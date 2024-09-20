import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database/db";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const formData = await req.json();
    const { leaguemate_ids, days } = formData;

    const mostTradedQuery = `
        SELECT t.adds, t.drops
        FROM trades t
        JOIN leagues l on t.league_id = l.league_id
        WHERE t.managers && $1
            AND to_timestamp(t.status_updated / 1000) > now() - make_interval(days => $2)
    `;

    const result = await pool.query(mostTradedQuery, [[leaguemate_ids], days]);

    const adds_obj: { [player_id: string]: string[] } = {};
    const drops_obj: { [player_id: string]: string[] } = {};

    result.rows.forEach((row) => {
      Object.keys(row.adds)
        .filter((player_id) => leaguemate_ids.includes(row.adds[player_id]))
        .forEach((player_id) => {
          if (!adds_obj[player_id]) {
            adds_obj[player_id] = [];
          }

          adds_obj[player_id].push(row.adds[player_id]);
        });

      Object.keys(row.drops)
        .filter((player_id) => leaguemate_ids.includes(row.drops[player_id]))
        .forEach((player_id) => {
          if (!drops_obj[player_id]) {
            drops_obj[player_id] = [];
          }

          drops_obj[player_id].push(row.drops[player_id]);
        });
    });

    return NextResponse.json({ adds_obj, drops_obj }, { status: 200 });
  }
}
