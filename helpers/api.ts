import { PoolClient } from "pg";
import {
  SleeperLeague,
  SleeperRoster,
  SleeperUser,
  SleeperDraft,
  SleeperDraftpick,
  SleeperMatchup,
  SleeperTrade,
} from "@/lib/types/sleeperApiRawTypes";
import {
  LeagueDb,
  Draftpick,
  UserDb,
  Matchup,
  Trade,
  Roster,
} from "@/lib/types";
import axios from "axios";

export const updateLeagues = async (
  leaguesToUpdate: SleeperLeague[],
  week: string | null,
  db: PoolClient,
  league_ids_db: string[]
) => {
  const users_db: UserDb[] = [];
  const userLeagues_db: { user_id: string; league_id: string }[] = [];
  const updatedLeagues: LeagueDb[] = [];
  const matchupsBatch: Matchup[] = [];
  const tradesBatch: Trade[] = [];

  const batchSize = 10;

  for (let i = 0; i < leaguesToUpdate.length; i += batchSize) {
    await Promise.all(
      leaguesToUpdate.slice(i, i + batchSize).map(async (leagueToUpdate) => {
        let league_draftpicks_obj;

        try {
          const league = await axios.get(
            `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}`
          );
          const rosters = await axios.get(
            `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/rosters`
          );
          const users = await axios.get(
            `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/users`
          );

          if (week && parseInt(week) <= 18) {
            const matchups = await axios.get(
              `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/matchups/${week}`
            );

            matchups.data.forEach((matchup: SleeperMatchup) => {
              matchupsBatch.push({
                week: parseInt(week),
                league_id: league.data.league_id,
                matchup_id: matchup.matchup_id,
                roster_id: matchup.roster_id,
                players: matchup.players,
                starters: matchup.starters,
                updatedat: new Date(),
              });
            });
          }

          let upcoming_draft: SleeperDraft | undefined = undefined;

          if (leagueToUpdate.settings.type === 2) {
            const drafts = await axios.get(
              `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/drafts`
            );
            const traded_picks = await axios.get(
              `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/traded_picks`
            );

            league_draftpicks_obj = getTeamDraftPicks(
              league.data,
              rosters.data,
              users.data,
              drafts.data,
              traded_picks.data
            );

            upcoming_draft = drafts.data.find(
              (d: SleeperDraft) =>
                d.draft_order &&
                d.settings.rounds === league.data.settings.rounds
            );
          } else {
            league_draftpicks_obj = {};
          }

          const rosters_w_username = getRostersUsername(
            rosters.data,
            users.data,
            league_draftpicks_obj
          );

          rosters_w_username
            .filter((ru) => ru.user_id)
            .forEach((ru) => {
              if (!users_db.some((u) => u.user_id === ru.user_id)) {
                users_db.push({
                  user_id: ru.user_id,
                  username: ru.username,
                  avatar: ru.avatar,
                  type: "LM",
                  updatedAt: new Date(),
                  createdAt: new Date(),
                });
              }

              userLeagues_db.push({
                user_id: ru.user_id,
                league_id: league.data.league_id,
              });
            });

          if (week && !league_ids_db.includes(leagueToUpdate.league_id)) {
            const trades_current = await getTrades(
              leagueToUpdate,
              week,
              rosters_w_username,
              upcoming_draft
            );

            tradesBatch.push(...trades_current);
            let prev_week = parseInt(week) - 1;

            while (prev_week > 0) {
              const matchups_prev = await axios.get(
                `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/matchups/${prev_week}`
              );

              matchups_prev.data.forEach((matchup: SleeperMatchup) => {
                matchupsBatch.push({
                  week: prev_week,
                  league_id: league.data.league_id,
                  matchup_id: matchup.matchup_id,
                  roster_id: matchup.roster_id,
                  players: matchup.players,
                  starters: matchup.starters,
                  updatedat: new Date(),
                });
              });

              const trades_prev = await getTrades(
                leagueToUpdate,
                prev_week.toString(),
                rosters_w_username,
                upcoming_draft
              );

              tradesBatch.push(...trades_prev);

              prev_week--;
            }
          }

          updatedLeagues.push({
            league_id: leagueToUpdate.league_id,
            name: league.data.name,
            avatar: league.data.avatar,
            season: league.data.season,
            settings: league.data.settings,
            scoring_settings: league.data.scoring_settings,
            roster_positions: league.data.roster_positions,
            rosters: rosters_w_username,
            updatedat: new Date(),
          });
        } catch (err: any) {
          console.log(err.message);
        }
      })
    );
  }

  try {
    try {
      await db.query("BEGIN");
      await upsertLeagues(db, updatedLeagues);
      await upsertUsers(db, users_db);
      await upsertUserLeagues(db, userLeagues_db);
      await upsertMatchups(db, matchupsBatch);
      await upsertTrades(db, tradesBatch);
      await db.query("COMMIT");
    } catch (err) {
      await db.query("ROLLBACK");
      console.error("Error upserting leagues:", err);
    }
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }

  return updatedLeagues;
};

export const getRostersUsername = (
  rosters: SleeperRoster[],
  users: SleeperUser[],
  league_draftpicks_obj: { [key: string]: Draftpick[] }
) => {
  const rosters_username = rosters.map((roster) => {
    const user = users.find((user) => user.user_id === roster.owner_id);

    return {
      roster_id: roster.roster_id,
      username: user?.display_name || "Orphan",
      user_id: roster.owner_id,
      avatar: user?.avatar || null,
      players: roster.players,
      draftpicks: league_draftpicks_obj[roster.roster_id] || [],
      starters: roster.starters || [],
      taxi: roster.taxi || [],
      reserve: roster.reserve || [],
      wins: roster.settings.wins,
      losses: roster.settings.losses,
      ties: roster.settings.ties,
      fp: parseFloat(
        `${roster.settings.fpts}.${roster.settings.fpts_decimal || 0}`
      ),
      fpa: parseFloat(
        `${roster.settings.fpts_against || 0}.${
          roster.settings.fpts_against_decimal || 0
        }`
      ),
    };
  });

  return rosters_username;
};

export const getTeamDraftPicks = (
  league: SleeperLeague,
  rosters: SleeperRoster[],
  users: SleeperUser[],
  drafts: SleeperDraft[],
  traded_picks: SleeperDraftpick[]
) => {
  const upcoming_draft = drafts.find(
    (x) =>
      x.status !== "complete" &&
      x.settings.rounds === league.settings.draft_rounds
  );

  const draft_season = upcoming_draft
    ? parseInt(league.season)
    : parseInt(league.season) + 1;

  const draft_order = upcoming_draft?.draft_order;

  const draft_picks_league: {
    [key: number]: Draftpick[];
  } = {};

  rosters.forEach((roster) => {
    const draft_picks_team: Draftpick[] = [];

    const user = users.find((u) => u.user_id === roster.owner_id);

    // loop through seasons (draft season and next two seasons)

    for (let j = draft_season; j <= draft_season + 2; j++) {
      // loop through rookie draft rounds

      for (let k = 1; k <= league.settings.draft_rounds; k++) {
        // check if each rookie pick is in traded picks

        const isTraded = traded_picks.find(
          (pick: SleeperDraftpick) =>
            parseInt(pick.season) === j &&
            pick.round === k &&
            pick.roster_id === roster.roster_id
        );

        // if it is not in traded picks, add to original manager

        if (!isTraded) {
          draft_picks_team.push({
            season: j,
            round: k,
            roster_id: roster.roster_id,
            original_user: {
              avatar: user?.avatar || "",
              user_id: roster.owner_id,
              username: user?.display_name || "Orphan",
            },
            order:
              (draft_order &&
                j === parseInt(upcoming_draft.season) &&
                draft_order[roster?.owner_id]) ||
              null,
          });
        }
      }
    }

    traded_picks
      .filter(
        (x) =>
          x.owner_id === roster.roster_id && parseInt(x.season) >= draft_season
      )
      .forEach((pick) => {
        const original_roster = rosters.find(
          (t) => t.roster_id === pick.roster_id
        );

        const original_user = users.find(
          (u) => u.user_id === original_roster?.owner_id
        );

        original_roster &&
          draft_picks_team.push({
            season: parseInt(pick.season),
            round: pick.round,
            roster_id: pick.roster_id,
            original_user: {
              avatar: original_user?.avatar || "",
              user_id: original_user?.user_id || "",
              username: original_user?.display_name || "Orphan",
            },
            order:
              (original_user &&
                draft_order &&
                parseInt(pick.season) === parseInt(upcoming_draft.season) &&
                draft_order[original_user?.user_id]) ||
              null,
          });
      });

    traded_picks
      .filter(
        (x) =>
          x.previous_owner_id === roster.roster_id &&
          parseInt(x.season) >= draft_season
      )
      .forEach((pick) => {
        const index = draft_picks_team.findIndex((obj) => {
          return (
            obj.season === parseInt(pick.season) &&
            obj.round === pick.round &&
            obj.roster_id === pick.roster_id
          );
        });

        if (index !== -1) {
          draft_picks_league[roster.roster_id].splice(index, 1);
        }
      });

    draft_picks_league[roster.roster_id] = draft_picks_team;
  });

  return draft_picks_league;
};

export const getTrades = async (
  leagueToUpdate: SleeperLeague,
  week: string,
  rosters_w_username: Roster[],
  upcoming_draft: SleeperDraft | undefined
) => {
  const tradesBatch: Trade[] = [];

  const transactions = await axios.get(
    `https://api.sleeper.app/v1/league/${leagueToUpdate.league_id}/transactions/${week}`
  );

  tradesBatch.push(
    ...transactions.data
      .filter(
        (t: SleeperTrade) => t.type === "trade" && t.status === "complete"
      )
      .map((t: SleeperTrade) => {
        const adds: { [key: string]: string } = {};
        const drops: { [key: string]: string } = {};

        const price_check: string[] = [];

        const draft_picks = t.draft_picks.map((dp) => {
          const original_user_id = rosters_w_username.find(
            (ru) => ru.roster_id === dp.roster_id
          )?.user_id;

          const order =
            (upcoming_draft?.draft_order &&
              original_user_id &&
              parseInt(upcoming_draft.season) === parseInt(dp.season) &&
              upcoming_draft.draft_order[original_user_id]) ||
            null;

          return {
            round: dp.round,
            season: dp.season,
            new: rosters_w_username.find((ru) => ru.roster_id === dp.owner_id)
              ?.user_id,
            old: rosters_w_username.find(
              (ru) => ru.roster_id === dp.previous_owner_id
            )?.user_id,
            original: rosters_w_username.find(
              (ru) => ru.roster_id === dp.roster_id
            )?.user_id,
            order: order,
          };
        });

        t.adds &&
          Object.keys(t.adds).forEach((add) => {
            const manager = rosters_w_username.find(
              (ru) => ru.roster_id === t.adds[add]
            );

            adds[add] = manager?.user_id || "0";

            const count =
              Object.keys(t.adds).filter((a) => t.adds[a] === t.adds[add])
                .length +
              t.draft_picks.filter((dp) => dp.owner_id === t.adds[add]).length;

            if (count === 1) {
              price_check.push(add);
            }
          });

        t.drops &&
          Object.keys(t.drops).forEach((drop) => {
            const manager = rosters_w_username.find(
              (ru) => ru.roster_id === t.drops[drop]
            );

            drops[drop] = manager?.user_id || "0";
          });

        return {
          ...t,
          league_id: leagueToUpdate.league_id,
          rosters: rosters_w_username,
          draft_picks: draft_picks,
          price_check: price_check,
          managers: Array.from(
            new Set([
              ...Object.values(adds || {}),
              ...Object.values(drops || {}),
              ...draft_picks.map((dp) => dp.new),
            ])
          ),
          players: [
            ...Object.keys(t.adds || {}),
            ...draft_picks.map(
              (pick) => `${pick.season} ${pick.round}.${pick.order}`
            ),
          ],
          adds: adds,
          drops: drops,
        };
      })
  );

  return tradesBatch;
};

export const upsertLeagues = async (
  db: PoolClient,
  updatedLeagues: LeagueDb[]
) => {
  console.log("Upserting...");
  const upsertLeaguesQuery = `
    INSERT INTO leagues (league_id, name, avatar, season, settings, scoring_settings, roster_positions, rosters, updatedat)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (league_id) DO UPDATE SET
      name = EXCLUDED.name,
      avatar = EXCLUDED.avatar,
      season = EXCLUDED.season,
      settings = EXCLUDED.settings,
      scoring_settings = EXCLUDED.scoring_settings,
      roster_positions = EXCLUDED.roster_positions,
      rosters = EXCLUDED.rosters,
      updatedat = EXCLUDED.updatedat;
  `;

  for (const league of updatedLeagues) {
    try {
      await db.query(upsertLeaguesQuery, [
        league.league_id,
        league.name,
        league.avatar,
        league.season,
        JSON.stringify(league.settings),
        JSON.stringify(league.scoring_settings),
        JSON.stringify(league.roster_positions),
        JSON.stringify(league.rosters),
        league.updatedat,
      ]);
    } catch (err: any) {
      console.log(err.message);
    }
  }
};

export const upsertUsers = async (db: PoolClient, users: UserDb[]) => {
  console.log(`Upserting ${users.length} users...`);

  const upsertUsersQuery = `
    INSERT INTO users (user_id, username, avatar, type, updatedAt, createdAt)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id) DO UPDATE SET
      username = EXCLUDED.username,
      avatar = EXCLUDED.avatar,
      type = CASE
        WHEN users.type = 'S' THEN users.type
        ELSE EXCLUDED.type
      END,
      updatedAt = EXCLUDED.updatedAt;
  `;

  for (const user of users) {
    try {
      await db.query(upsertUsersQuery, [
        user.user_id,
        user.username,
        user.avatar,
        user.type,
        user.updatedAt,
        user.createdAt,
      ]);
    } catch (err: any) {
      console.log(err.message);
    }
  }
};

export const upsertUserLeagues = async (
  db: PoolClient,
  userLeagues: { user_id: string; league_id: string }[]
) => {
  const upsertUserLeaguesQuery = `
    INSERT INTO userLeagues (user_id, league_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;

  for (const userLeague of userLeagues) {
    try {
      await db.query(upsertUserLeaguesQuery, [
        userLeague.user_id,
        userLeague.league_id,
      ]);
    } catch (err: any) {
      console.log(err.message);
    }
  }
};

export const upsertMatchups = async (db: PoolClient, matchups: Matchup[]) => {
  if (matchups.length === 0) return;

  const upsertMatchupsQuery = `
    INSERT INTO matchups (week, matchup_id, roster_id, players, starters, league_id, updatedat)
    VALUES ${matchups
      .map(
        (_, i) =>
          `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${
            i * 7 + 5
          }, $${i * 7 + 6}, $${i * 7 + 7})`
      )
      .join(", ")}
    ON CONFLICT (week, roster_id, league_id) DO UPDATE SET
      matchup_id = EXCLUDED.matchup_id,
      players = EXCLUDED.players,
      starters = EXCLUDED.starters,
      updatedat = EXCLUDED.updatedat
  `;

  const values = matchups.flatMap((matchup) => [
    matchup.week,
    matchup.matchup_id,
    matchup.roster_id,
    matchup.players,
    matchup.starters,
    matchup.league_id,
    matchup.updatedat,
  ]);

  try {
    await db.query(upsertMatchupsQuery, values);
  } catch (err: any) {
    console.log(err.message + " MATCHUPS");
  }
};

export const upsertTrades = async (db: PoolClient, trades: Trade[]) => {
  if (trades.length === 0) return;

  const upsertTradesQuery = `
    INSERT INTO trades (transaction_id, status_updated, adds, drops, draft_picks, price_check, rosters, managers, players, league_id)
     VALUES ${trades
       .map(
         (_, i) =>
           `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${
             i * 10 + 5
           }, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${
             i * 10 + 9
           }, $${i * 10 + 10})`
       )
       .join(", ")}
    ON CONFLICT (transaction_id) DO UPDATE SET
      draft_picks = EXCLUDED.draft_picks,
      price_check = EXCLUDED.price_check,
      managers = EXCLUDED.managers;
  `;

  const values = trades.flatMap((trade) => [
    trade.transaction_id,
    trade.status_updated,
    JSON.stringify(trade.adds),
    JSON.stringify(trade.drops),
    JSON.stringify(trade.draft_picks),
    trade.price_check,
    JSON.stringify(trade.rosters),
    trade.managers,
    trade.players,
    trade.league_id,
  ]);

  try {
    await db.query(upsertTradesQuery, values);
  } catch (err: any) {
    console.log(err.message + " TRADES");
  }
};
