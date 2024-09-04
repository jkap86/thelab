import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";
import { SleeperPlayerStat } from "@/lib/types/sleeperApiRawTypes";

export async function GET(req: NextRequest) {
  const fpseason_raw = fs.readFileSync("./data/fpseason.json", "utf-8");

  const fpseason = JSON.parse(fpseason_raw);

  if (fpseason.updatedAt > new Date().getTime() - 24 * 60 * 60 * 1000) {
    return NextResponse.json(fpseason.data, { status: 200 });
  } else {
    console.log("Updating FP Season...");

    try {
      const fpseason = await axiosInstance.get(
        "https://api.sleeper.com/projections/nfl/2024/?season_type=regular"
      );

      const fp = fpseason.data
        .filter((player_stat: SleeperPlayerStat) => player_stat.stats.pts_ppr)
        .map((player_stat: SleeperPlayerStat) => {
          return {
            player_id: player_stat.player_id,
            stats: player_stat.stats,
            injury_status: player_stat.player.injury_status || "",
          };
        });

      fs.writeFileSync(
        "./data/fpseason.json",
        JSON.stringify({ data: fp, updatedAt: new Date().getTime() })
      );

      return NextResponse.json(fp, { status: 200 });
    } catch (err: any) {
      console.log(err.message);
      return NextResponse.json(err, { status: 500 });
    }
  }
}
