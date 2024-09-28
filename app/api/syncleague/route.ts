import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import pool from "@/lib/database/db";
import { updateLeagues } from "@/helpers/api";
import { Roster } from "@/lib/types";

export async function GET(req: NextRequest) {
  const db = await pool.connect();

  const { searchParams } = new URL(req.url);

  const league_id = searchParams.get("league_id");
  const userRoster_id = parseInt(searchParams.get("roster_id") || "0");
  const week = searchParams.get("week");

  try {
    const league = await axiosInstance.get(
      `https://api.sleeper.app/v1/league/${league_id}`
    );

    const updatedLeagues = await updateLeagues([league.data], week, db, [
      league_id || "",
    ]);

    const userRoster = updatedLeagues[0].rosters.find(
      (roster: Roster) =>
        roster.roster_id === userRoster_id && (roster.players || []).length > 0
    );

    const league_to_send = {
      ...updatedLeagues[0],
      userRoster,
    };

    return NextResponse.json(league_to_send, {
      status: 200,
    });
  } catch (err: any) {
    console.log(err.message);
  } finally {
    db.release();
  }
}
