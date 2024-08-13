import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import pool from "@/lib/database/db";
import { Matchup } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const league_id = searchParams.get("league_id");
  const week = searchParams.get("week");

  try {
    const matchups = await axiosInstance.get(
      `https://api.sleeper.app/v1/league/${league_id}/matchups/${week}`,
      {
        params: {
          t: new Date().getTime(),
        },
      }
    );

    const upsertMatchupQuery = `
        INSERT INTO matchups (week, matchup_id, roster_id, players, starters, league_id, updatedat)
        VALUES ${matchups.data
          .map(
            (_: any, i: number) =>
              `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${
                i * 7 + 5
              }, $${i * 7 + 6}, $${i * 7 + 7})`
          )
          .join(", ")}
        ON CONFLICT (week, roster_id, league_id) DO UPDATE SET
            matchup_id = EXCLUDED.matchup_id,
            players = EXCLUDED.players,
            starters = EXCLUDED.starters,
            updatedat = EXCLUDED.updatedat
    `;

    const values = matchups.data.flatMap((matchup: Matchup) => [
      week,
      matchup.matchup_id,
      matchup.roster_id,
      matchup.players,
      matchup.starters,
      league_id,
      new Date(),
    ]);

    await pool.query(upsertMatchupQuery, values);

    return NextResponse.json(matchups.data, { status: 200 });
  } catch (err: any) {
    console.log(err.message);
  }
}
