import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import axiosInstance from "@/lib/axiosInstance";
import { Allplayer } from "@/lib/types";
import { SleeperPlayerStat } from "@/lib/types/sleeperApiRawTypes";
import { convertTeamAbbrev } from "@/helpers/miscVariables";

type MflMatchup = {
  status: string;
  kickoff: string;
  gameSecondsRemaining: string;
  team: {
    id: string;
  }[];
};

export async function GET(req: NextRequest) {
  const livestats_raw = fs.readFileSync("./data/livestats.json", "utf-8");
  const livestats = JSON.parse(livestats_raw);

  const fpweek_raw = fs.readFileSync("./data/fpweek.json", "utf-8");
  const fpweek = JSON.parse(fpweek_raw);

  const allplayers_raw = fs.readFileSync("./data/allplayers.json", "utf-8");
  const allplayers_parsed = JSON.parse(allplayers_raw);
  const allplayers_array = allplayers_parsed.data;
  const allplayers = Object.fromEntries(
    allplayers_array.map((player_obj: Allplayer) => [
      player_obj.player_id,
      player_obj,
    ])
  );

  const { searchParams } = new URL(req.url);
  const week = searchParams.get("week");

  console.log({ week });

  if (livestats.updateAt > new Date().getTime() && livestats.week === week) {
    console.log("return saved stats");
    return NextResponse.json(livestats, { status: 200 });
  } else {
    console.log("updating stats");
    let livestats_updated;
    let schedule_week_live;
    try {
      livestats_updated = await axiosInstance.get(
        `https://api.sleeper.com/stats/nfl/2024/${week}?season_type=regular`
      );
    } catch (err: any) {
      console.log(err.message + "STATS - SLEEPER");
      livestats_updated = { data: [] };
    }

    try {
      schedule_week_live = await axiosInstance.get(
        `https://api.myfantasyleague.com/fflnetdynamic2024/nfl_sched_${week}.json`
      );
    } catch (err: any) {
      console.log(err.message + "SCHEDULE - MFL");
      schedule_week_live = { data: [] };
    }
    const gamesec_remaining_obj: { [key: string]: number } = {};

    schedule_week_live.data?.nflSchedule?.matchup?.forEach(
      (matchup: MflMatchup) => {
        matchup.team.forEach((team) => {
          const sleeper_team_abbrev = convertTeamAbbrev(team.id);
          gamesec_remaining_obj[sleeper_team_abbrev] = parseInt(
            matchup.gameSecondsRemaining
          );
        });
      }
    );

    const player_ids = Array.from(
      new Set([
        ...fpweek.data.map((fp: { player_id: string }) => fp.player_id),
        ...livestats_updated.data.map(
          (player_stat: SleeperPlayerStat) => player_stat.player_id
        ),
      ])
    );

    const livestats = player_ids.map((player_id) => {
      const player_proj_obj =
        fpweek.data.find(
          (fp: { player_id: string; stats: { [cat: string]: number } }) =>
            fp.player_id === player_id
        )?.stats || {};

      const player_stats_obj = livestats_updated.data.find(
        (ls: SleeperPlayerStat) => ls.player_id === player_id
      );

      const percent_game_left =
        (gamesec_remaining_obj?.[allplayers[player_id]?.team] || 0) / 3600;

      const stat_cats = Array.from(
        new Set([
          ...Object.keys(player_proj_obj || {}),
          ...Object.keys(player_stats_obj?.stats || {}),
        ])
      );

      return {
        player_id: player_id,
        stats: Object.fromEntries(
          stat_cats.map((cat) => [cat, player_stats_obj?.stats?.[cat] || 0])
        ),
        proj_remaining: Object.fromEntries(
          stat_cats.map((cat) => [
            cat,
            (player_proj_obj?.[cat] || 0) * percent_game_left,
          ])
        ),
        percent_game_left,
      };
    });

    let updateAt;

    const games_in_progress = schedule_week_live.data.nflSchedule.matchup.some(
      (m: MflMatchup) => m.status === "INPROG"
    );

    if (games_in_progress) {
      updateAt = new Date().getTime() + 30000;
    } else {
      const upcoming_kickoffs = schedule_week_live.data.nflSchedule.matchup
        .filter((m: MflMatchup) => m.status === "SCHED")
        .map((m: MflMatchup) => parseInt(m.kickoff) * 1000)
        .sort((a: number, b: number) => a - b);

      if (upcoming_kickoffs.length > 0) {
        updateAt = Math.min(
          upcoming_kickoffs[0],
          new Date().getTime() + 1000 * 60 * 15
        );
      } else {
        updateAt = new Date().getTime() + 1000 * 60 * 60 * 12;
      }
    }

    console.log({
      updateAt: new Date(updateAt).toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
    });

    fs.writeFileSync(
      "./data/livestats.json",
      JSON.stringify({
        week,
        data: livestats,
        updateAt: updateAt,
      })
    );

    return NextResponse.json({ data: livestats, updateAt }, { status: 200 });
  }
}
