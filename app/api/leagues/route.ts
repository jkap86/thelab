import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database/db";
import { SleeperLeague } from "@/lib/types/sleeperApiRawTypes";
import { League, LeagueDb, Roster } from "@/lib/types";
import { updateLeagues } from "@/helpers/api";

export async function GET(req: NextRequest) {
  const db = await pool.connect();
  const league_update_cutoff: Date = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const { searchParams } = new URL(req.url);

  const user_id_searched = searchParams.get("user_id");

  try {
    const leagues = await axios.get(
      `https://api.sleeper.app/v1/user/${user_id_searched}/leagues/nfl/${process.env.SEASON}`
    );

    const league_ids = leagues.data.map(
      (league: SleeperLeague) => league.league_id
    );

    const findUpdatedLeaguesQuery = `
      SELECT * FROM leagues WHERE league_id = ANY($1);
    `;

    const result = await db.query(findUpdatedLeaguesQuery, [league_ids]);

    const upToDateLeagues = result.rows.filter(
      (league) => league.updatedat > league_update_cutoff
    );

    const upToDateLeagueIds = upToDateLeagues.map((league) => league.league_id);

    const leaguesToUpdate = leagues.data.filter(
      (league: SleeperLeague) => !upToDateLeagueIds.includes(league.league_id)
    );

    const updatedLeagues = await updateLeagues(leaguesToUpdate, db);

    const leagues_to_send: League[] = [];

    [...upToDateLeagues, ...updatedLeagues].forEach((league) => {
      const userRoster = league.rosters.find(
        (roster: Roster) =>
          roster.user_id === user_id_searched &&
          (roster.players || []).length > 0
      );

      if (userRoster) {
        const index = leagues.data.findIndex(
          (league_sleeper: LeagueDb) =>
            league_sleeper.league_id === league.league_id
        );

        leagues_to_send.push({
          ...league,
          index,
          userRoster,
        });
      }
    });

    return NextResponse.json(
      leagues_to_send.sort((a, b) => a.index - b.index),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return NextResponse.json("Error...", { status: 500 });
  }
}
