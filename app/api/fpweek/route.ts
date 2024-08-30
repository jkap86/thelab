import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";
import { SleeperPlayerStat } from "@/lib/types/sleeperApiRawTypes";
import { Allplayer } from "@/lib/types";

type MflMatchup = {
  kickoff: number;
  team: {
    id: string;
  }[];
};

const convertTeamAbbrev = (mfl_team_id: string) => {
  let sleeper_team_abbrev;

  switch (mfl_team_id) {
    case "JAC":
      sleeper_team_abbrev = "JAX";
      break;
    case "GBP":
      sleeper_team_abbrev = "GB";
      break;
    case "KCC":
      sleeper_team_abbrev = "KC";
      break;
    case "LVR":
      sleeper_team_abbrev = "LV";
      break;
    case "NEP":
      sleeper_team_abbrev = "NE";
      break;
    case "NOS":
      sleeper_team_abbrev = "NO";
      break;
    case "SFO":
      sleeper_team_abbrev = "SF";
      break;
    case "TBB":
      sleeper_team_abbrev = "TB";
      break;
    default:
      sleeper_team_abbrev = mfl_team_id;
      break;
  }

  return sleeper_team_abbrev;
};

export async function GET(req: NextRequest) {
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

  if (
    fpweek.updatedAt > new Date().getTime() - 15 * 60 * 1000 &&
    fpweek.week === week
  ) {
    return NextResponse.json(fpweek.data, { status: 200 });
  } else {
    console.log(`Updating FP Week ${week}...`);

    try {
      const [fpweek_updated, schedule_week] = await Promise.all([
        await axiosInstance.get(
          `https://api.sleeper.com/projections/nfl/2024/${week}?season_type=regular`
        ),
        await axiosInstance.get(
          `https://api.myfantasyleague.com/2024/export?TYPE=nflSchedule&W=${week}&JSON=1`
        ),
      ]);

      const kickoffs_obj: { [key: string]: number } = {};

      schedule_week.data.nflSchedule.matchup.forEach((matchup: MflMatchup) => {
        matchup.team.forEach((team) => {
          let kickoff_day = new Date(matchup.kickoff * 1000).getUTCDay();

          if (kickoff_day < 3) {
            kickoff_day += 8;
          }

          let kickoff_hour =
            Math.round(new Date(matchup.kickoff * 1000).getUTCHours() / 10) *
            10;

          kickoffs_obj[team.id] = parseFloat(
            `${kickoff_day}.${kickoff_hour.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
            })}`
          );
        });
      });

      const fp = fpweek_updated.data
        .filter((player_stat: SleeperPlayerStat) => player_stat.stats.pts_ppr)
        .map((player_stat: SleeperPlayerStat) => {
          const mfl_team_id = Object.keys(kickoffs_obj).find((t) =>
            t
              .replace("JAC", "JAX")
              .startsWith(allplayers[player_stat.player_id]?.team)
          );

          return {
            player_id: player_stat.player_id,
            stats: player_stat.stats,
            injury_status: player_stat.player.injury_status || "",
            kickoff: mfl_team_id && kickoffs_obj[mfl_team_id],
          };
        });

      fs.writeFileSync(
        "./data/fpweek.json",
        JSON.stringify({ week, data: fp, updatedAt: new Date().getTime() })
      );

      return NextResponse.json(fp, { status: 200 });
    } catch (err: any) {
      console.log(err.message);
      return NextResponse.json(err, { status: 500 });
    }
  }
}
