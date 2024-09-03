import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  SleeperDraft,
  SleeperDraftpickPicktracker,
  SleeperLeague,
  SleeperUser,
} from "@/lib/types/sleeperApiRawTypes";
import fs from "fs";
import { Allplayer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const league_id = searchParams.get("league_id");

  let league: { data: SleeperLeague };
  let active_draft;

  try {
    league = await axios.get(`https://api.sleeper.app/v1/league/${league_id}`);

    const drafts = await axios.get(
      `https://api.sleeper.app/v1/league/${league_id}/drafts`
    );

    active_draft = drafts.data.find(
      (d: SleeperDraft) =>
        d.settings.slots_k > 0 &&
        d.settings.rounds > league.data.settings.draft_rounds
    );

    if (active_draft) {
      const allplayers_string = fs.readFileSync(
        "./data/allplayers.json",
        "utf-8"
      );

      const allplayers = JSON.parse(allplayers_string);
      const draft_picks = await axios.get(
        `https://api.sleeper.app/v1/draft/${active_draft.draft_id}/picks`
      );
      const users = await axios.get(
        `https://api.sleeper.app/v1/league/${league_id}/users`
      );

      const teams = Object.keys(active_draft.draft_order || {}).length;

      const picks = draft_picks.data
        .filter(
          (pick: SleeperDraftpickPicktracker) => pick.metadata.position === "K"
        )
        .map((pick: SleeperDraftpickPicktracker, index: number) => {
          return {
            pick:
              Math.floor(index / teams) +
              1 +
              "." +
              ((index % teams) + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
              }),
            player_name: allplayers.data.find(
              (ap: Allplayer) => ap.player_id === pick.player_id
            )?.full_name,
            player_id: pick.player_id,
            picked_by: users.data.find(
              (u: SleeperUser) => u.user_id === pick.picked_by
            )?.display_name,
            picked_by_avatar: users.data.find(
              (u: SleeperUser) => u.user_id === pick.picked_by
            )?.avatar,
          };
        });

      return NextResponse.json({ league: league.data, picks }, { status: 200 });
    } else {
      return NextResponse.json("no draft found", { status: 200 });
    }
  } catch (err) {
    return NextResponse.json("ERROR", { status: 200 });
  }
}
