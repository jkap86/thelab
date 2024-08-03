import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database/db";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const formData = await req.json();

    const { leaguemate_ids, offset, limit } = formData;

    const getLmTradesQuery = ` 
      SELECT t.*, l.name, l.avatar, l.settings, l.scoring_settings, l.roster_positions
      FROM trades t
      JOIN leagues l ON t.league_id = l.league_id
      WHERE t.managers && $1
      ORDER BY t.status_updated DESC
      LIMIT $2 OFFSET $3
    `;

    const countLmTradesQuery = `
      SELECT COUNT(*) 
      FROM trades
      WHERE managers && $1
    `;

    const result = await pool.query(getLmTradesQuery, [
      leaguemate_ids,
      limit,
      offset,
    ]);

    const count = await pool.query(countLmTradesQuery, [leaguemate_ids]);

    return NextResponse.json(
      {
        count: count.rows[0].count,
        rows: result.rows,
      },
      { status: 200 }
    );
  }
}
