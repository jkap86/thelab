import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";
import { SleeperPlayerStat } from "@/lib/types/sleeperApiRawTypes";

export async function GET(req: NextRequest) {
  const fpweek_raw = fs.readFileSync("./data/fpweek.json", "utf-8");
  const fpweek = JSON.parse(fpweek_raw);

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
      const fpweek_updated = await axiosInstance.get(
        `https://api.sleeper.com/projections/nfl/2024/${week}?season_type=regular`
      );

      const fp = fpweek_updated.data
        .filter((player_stat: SleeperPlayerStat) => player_stat.stats.pts_ppr)
        .map((player_stat: SleeperPlayerStat) => {
          return {
            player_id: player_stat.player_id,
            stats: player_stat.stats,
            injury_status: player_stat.player.injury_status || "",
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
