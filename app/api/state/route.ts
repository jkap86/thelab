import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";
import fs from "fs";

export async function GET(req: NextRequest) {
  const state_jsonString = fs.readFileSync("./data/state.json", "utf-8");
  const state_json = JSON.parse(state_jsonString);

  if (state_json.updatedAt > new Date().getTime() - 3 * 60 * 60 * 1000) {
    return NextResponse.json(state_json.data, { status: 200 });
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

      return NextResponse.json(state_updated.data, { status: 200 });
    } catch (err: any) {
      console.log(err.message);
      return NextResponse.json(state_json.data, { status: 200 });
    }
  }
}
