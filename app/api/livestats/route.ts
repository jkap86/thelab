import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import axiosInstance from "@/lib/axiosInstance";
import { Allplayer } from "@/lib/types";
import { SleeperPlayerStat } from "@/lib/types/sleeperApiRawTypes";
import { convertTeamAbbrev } from "@/helpers/miscVariables";

type MflMatchup = {
  gameSecondsRemaining: string;
  team: {
    id: string;
  }[];
};

export async function GET(req: NextRequest) {
  const livestats_raw = fs.readFileSync("./data/livestats.json", "utf-8");
  const livestats = JSON.parse(livestats_raw);

  const { searchParams } = new URL(req.url);
  const week = searchParams.get("week");

  console.log({ week });

  if (livestats.updateAt > new Date().getTime() && livestats.week === week) {
    console.log("return saved stats");
    return NextResponse.json(livestats.data, { status: 200 });
  } else {
    console.log("updating stats");
    let livestats_updated;
    let schedule_week_live;
    try {
      livestats_updated = await axiosInstance.get(
        `https://api.sleeper.com/stats/nfl/2024/${week}?season_type=regular`
      );

      console.log({ livestats_updated });
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

    const livestats = livestats_updated.data.map(
      (player_stat: SleeperPlayerStat) => {
        const percent_game_left =
          (gamesec_remaining_obj[player_stat.team] || 0) / 3600;
        return {
          player_id: player_stat.player_id,
          stats: player_stat.stats,
          percent_game_left,
        };
      }
    );

    fs.writeFileSync(
      "./data/livestats.json",
      JSON.stringify({
        week,
        data: livestats,
        updateAt: new Date().getTime() + 60000,
      })
    );

    return NextResponse.json(livestats, { status: 200 });
  }
}
