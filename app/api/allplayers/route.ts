import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";
import { Allplayer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const data: {
    allplayers: Allplayer[];
    state: { [key: string]: string | number };
  } = { allplayers: [], state: {} };

  const allplayers_json = fs.readFileSync("./data/allplayers.json", "utf-8");
  const allplayers = JSON.parse(allplayers_json);

  if (allplayers.updatedAt > new Date().getTime() - 24 * 60 * 60 * 1000) {
    data.allplayers = allplayers.data;
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

      fs.writeFileSync(
        "./data/allplayers.json",
        JSON.stringify({
          data: allplayers_array,
          updatedAt: new Date().getTime(),
        })
      );

      data.allplayers = allplayers_array;
    } catch (error: any) {
      console.log(error.message);

      data.allplayers = allplayers.data;
    }
  }

  const state_jsonString = fs.readFileSync("./data/state.json", "utf-8");
  const state_json = JSON.parse(state_jsonString);

  if (state_json.updatedAt > new Date().getTime() - 1 * 60 * 60 * 1000) {
    data.state = state_json.data;
  } else {
    console.log("Updating STATE...");

    try {
      const state_updated = await axiosInstance.get(
        "https://api.sleeper.app/v1/state/nfl"
      );

      fs.writeFileSync(
        "./data/state.json",
        JSON.stringify({
          data: state_updated.data,
          updatedAt: new Date().getTime(),
        })
      );

      data.state = state_updated.data;
    } catch (err: any) {
      console.log(err.message);
      data.state = state_json.data;
    }
  }
  return NextResponse.json(data, { status: 200 });
}
