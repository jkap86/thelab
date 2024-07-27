import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";
import { Allplayer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const allplayers_json = fs.readFileSync("./data/allplayers.json", "utf-8");

  const allplayers = JSON.parse(allplayers_json);

  if (allplayers.updatedAt > new Date().getTime() - 24 * 60 * 60 * 1000) {
    return NextResponse.json(allplayers.data, { status: 200 });
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
          full_name: player_obj.full_name,
          age: player_obj.age,
        });
      });

      fs.writeFileSync(
        "./data/allplayers.json",
        JSON.stringify({
          data: allplayers_array,
          updatedAt: new Date().getTime(),
        })
      );

      return NextResponse.json(allplayers_array, { status: 200 });
    } catch (error: any) {
      console.log(error.message);

      return NextResponse.json(allplayers.data, { status: 200 });
    }
  }
}
