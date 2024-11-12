import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import pool from "@/lib/database/db";
import { Allplayer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const data: {
    allplayers: Allplayer[];
    state: { [key: string]: string | number };
  } = { allplayers: [], state: {} };

  const allplayers_db = await pool.query(
    `SELECT * FROM common WHERE name = $1;`,
    ["allplayers"]
  );

  const allplayers = allplayers_db.rows[0];

  if (
    allplayers?.updatedat > new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  ) {
    data.allplayers = allplayers.data;

    console.log(`Last ALLPLAYERS update - ${allplayers.updatedat}`);
  } else {
    console.log("Updating Allplayers...");

    try {
      const allplayers_updated = await axiosInstance.get(
        "https://api.sleeper.app/v1/players/nfl"
      );

      const allplayers_array: Allplayer[] = [];

      Object.values(allplayers_updated.data).forEach((value) => {
        const player_obj = value as Allplayer;

        allplayers_array.push({
          player_id: player_obj.player_id,
          position: player_obj.position,
          team: player_obj.team || "FA",
          full_name:
            player_obj.position === "DEF"
              ? `${player_obj.player_id} DEF`
              : player_obj.full_name,
          age: player_obj.age,
          fantasy_positions: player_obj.fantasy_positions,
          years_exp: player_obj.years_exp,
        });
      });

      await pool.query(
        `
          INSERT INTO common (name, data, updatedat) 
          VALUES ($1, $2, $3)
          ON CONFLICT (name) 
          DO UPDATE SET 
            data = EXCLUDED.data,
            updatedat = EXCLUDED.updatedat
          RETURNING *;
        `,
        ["allplayers", JSON.stringify(allplayers_array), new Date()]
      );

      data.allplayers = allplayers_array;
    } catch (error: any) {
      console.log(error.message);

      data.allplayers = allplayers.data;
    }
  }

  const state_db = await pool.query(`SELECT * FROM common WHERE name = $1;`, [
    "state",
  ]);

  const state = state_db.rows[0];

  if (state?.updatedat > new Date(new Date().getTime() - 1 * 60 * 60 * 1000)) {
    data.state = state.data;

    console.log(`Last STATE update - ${state.updatedAt}`);
  } else {
    console.log("Updating STATE...");

    try {
      const state_updated = await axiosInstance.get(
        "https://api.sleeper.app/v1/state/nfl"
      );

      await pool.query(
        `
          INSERT INTO common (name, data, updatedat) 
          VALUES ($1, $2, $3)
          ON CONFLICT (name) 
          DO UPDATE SET 
            data = EXCLUDED.data,
            updatedat = EXCLUDED.updatedat
          RETURNING *;
        `,
        ["state", state_updated.data, new Date()]
      );

      data.state = state_updated.data;
    } catch (err: any) {
      console.log(err.message);
    }
  }
  return NextResponse.json(data, { status: 200 });
}
