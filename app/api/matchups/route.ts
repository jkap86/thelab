import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database/db";
import fs from "fs";
import axiosInstance from "@/lib/axiosInstance";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const state_jsonString = fs.readFileSync("./data/state.json", "utf-8");

    const state_json = JSON.parse(state_jsonString);

    let state;

    if (state_json.updatedAt > new Date().getTime() - 3 * 60 * 60 * 1000) {
      state = state_json.data;
    } else {
      console.log("Updating State...");

      const state_updated = await axiosInstance.get(
        "https://api.sleeper.app/v1/state/nfl"
      );

      state = state_updated.data;

      fs.writeFileSync("./data/state.json", JSON.stringify(state));
    }

    const formData = await req.json();

    const { league_ids } = formData;

    const getMatchupsQuery = `
        SELECT * 
        FROM matchups
        WHERE league_id = ANY($1)
            AND week = $2
    `;

    const result = await pool.query(getMatchupsQuery, [
      league_ids,
      state.display_week,
    ]);

    return NextResponse.json(result, { status: 200 });
  }
}
