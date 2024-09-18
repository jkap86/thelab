import axios from "axios";
import { AppDispatch } from "../store";
import {
  User,
  League,
  Allplayer,
  Leaguemate,
  Trade,
  Matchup,
  PlayerProjection,
  MatchupOptimal,
  PlayerStat,
} from "@/lib/types";
import {
  getOptimalStarters,
  getOptimalStartersMatchup,
  getPlayerProjection,
  getPlayerShares,
} from "@/helpers/getPlayerShares";
import { getTradeTips } from "@/helpers/getTradeTips";

interface fetchUserStartAction {
  type: "FETCH_USER_START";
}

interface setStateUserAction {
  type: "SET_STATE_USER";
  payload: User;
}

interface fetchUserErrorAction {
  type: "FETCH_USER_ERROR";
  payload: string;
}

interface fetchLeaguesStartAction {
  type: "FETCH_LEAGUES_START";
}

interface setStateLeaguesAction {
  type: "SET_STATE_LEAGUES";
  payload: {
    leagues: { [key: string]: League };
    playershares: {
      [key: string]: {
        owned: string[];
        taken: {
          lm_roster_id: number;
          lm: User;
          league: string;
        }[];
        available: string[];
      };
    };
    leaguemates: { [key: string]: Leaguemate };
  };
}

interface fetchLeaguesErrorAction {
  type: "FETCH_LEAGUES_ERROR";
  payload: string;
}

interface syncLeagueStartAction {
  type: "SYNC_LEAGUE_START";
  payload: string;
}

interface syncLeagueEndAction {
  type: "SYNC_LEAGUE_END";
  payload: {
    leagues: { [key: string]: League };
    playershares: {
      [key: string]: {
        owned: string[];
        taken: {
          lm_roster_id: number;
          lm: User;
          league: string;
        }[];
        available: string[];
      };
    };
    leaguemates: {
      [key: string]: {
        user_id: string;
        username: string;
        avatar: string | null;
        leagues: string[];
      };
    };
  };
}

interface syncLeagueErrorAction {
  type: "SYNC_LEAGUE_ERROR";
  payload: string;
}

interface fetchMatchupsStartAction {
  type: "FETCH_MATCHUPS_START";
}

interface fetchMatchupsEndAction {
  type: "FETCH_MATCHUPS_END";
  payload: {
    [key: string]: {
      user: MatchupOptimal;
      opp: MatchupOptimal;
      median?: number;
      league_matchups: Matchup[];
    };
  };
}

interface fetchMatchupsErrorAction {
  type: "FETCH_MATCHUPS_ERROR";
  payload: string;
}

interface syncMatchupStartAction {
  type: "SYNC_MATCHUP_START";
  payload: string;
}

interface syncMatchupEndAction {
  type: "SYNC_MATCHUP_END";
  payload: {
    matchups: {
      user: MatchupOptimal;
      opp: MatchupOptimal;
      median?: number;
      league_matchups: Matchup[];
    };
    league_id: string;
  };
}

interface syncMatchupErrorAction {
  type: "SYNC_MATCHUP_ERROR";
  payload: string;
}

interface fetchLmTradesStartAction {
  type: "FETCH_LMTRADES_START";
}

interface setStateLmTradesAction {
  type: "SET_STATE_LMTRADES";
  payload: {
    count: number;
    trades: Trade[];
  };
}

interface fetchLmTradesErrorAction {
  type: "FETCH_LMTRADES_ERROR";
  payload: string;
}

interface fetchFilteredLmTradesEndAction {
  type: "FETCH_FILTERED_LMTRADES_END";
  payload: {
    manager: string | false;
    player: string | false;
    count: number;
    trades: Trade[];
  };
}

interface setLiveStatsAction {
  type: "SET_LIVE_STATS";
  payload: {
    live: {
      [key: string]: {
        user: {
          points_total: number;
          proj_remaining_total: number;
          players_points: { [player_id: string]: number };
          players_proj_remaining: { [player_id: string]: number };
        };
        opp: {
          points_total: number;
          proj_remaining_total: number;
          players_points: { [player_id: string]: number };
          players_proj_remaining: { [player_id: string]: number };
        };
        median: {
          current: number | undefined;
          projected: number | undefined;
        };
      };
    };
    updateAt: number;
  };
}

interface resetState {
  type: "RESET_STATE";
}

export type UserActionTypes =
  | fetchUserStartAction
  | setStateUserAction
  | fetchUserErrorAction
  | fetchLeaguesStartAction
  | setStateLeaguesAction
  | fetchLeaguesErrorAction
  | syncLeagueStartAction
  | syncLeagueEndAction
  | syncLeagueErrorAction
  | fetchMatchupsStartAction
  | fetchMatchupsEndAction
  | fetchMatchupsErrorAction
  | syncMatchupStartAction
  | syncMatchupEndAction
  | syncMatchupErrorAction
  | fetchLmTradesStartAction
  | setStateLmTradesAction
  | fetchLmTradesErrorAction
  | fetchFilteredLmTradesEndAction
  | setLiveStatsAction
  | resetState;

export const resetState = () => (dispatch: AppDispatch) => {
  dispatch({
    type: "RESET_STATE",
  });
};

export const fetchUser =
  (username: string) => async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_USER_START",
    });

    try {
      const response: { data: User } = await axios.get("/api/user", {
        params: { username: username },
      });

      dispatch({
        type: "SET_STATE_USER",
        payload: {
          user_id: response.data.user_id,
          username: response.data.username,
          avatar: response.data.avatar,
        },
      });
    } catch (err: any) {
      console.log(err.message);
      dispatch({
        type: "FETCH_USER_ERROR",
        payload: err.response.data || err.message,
      });
    }
  };

export const fetchLeagues =
  (
    user_id: string,
    week: number,
    fpseason: { [key: string]: { [key: string]: number } },
    allplayers: { [key: string]: Allplayer }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_LEAGUES_START",
    });

    try {
      const response: { data: League[] } = await axios.get("/api/leagues", {
        params: { user_id, week },
      });

      const leagues_obj = Object.fromEntries(
        response.data.map((league) => {
          return [
            league.league_id,
            {
              ...league,
              rosters: league.rosters.map((r) => {
                const { starters, proj_ros_s, proj_ros_t } = getOptimalStarters(
                  { players: r.players || [] },
                  league.roster_positions,
                  fpseason,
                  allplayers,
                  league.scoring_settings
                );

                return {
                  ...r,
                  starters: starters,
                  proj_ros_s,
                  proj_ros_t,
                };
              }),
            },
          ];
        })
      );
      const { playershares, leaguemates } = getPlayerShares(response.data);

      dispatch({
        type: "SET_STATE_LEAGUES",
        payload: {
          leagues: leagues_obj,
          playershares: playershares,
          leaguemates: leaguemates,
        },
      });
    } catch (err: any) {
      console.log({ err });
      dispatch({
        type: "FETCH_LEAGUES_ERROR",
        payload: err.message,
      });
    }
  };

export const syncLeague =
  (
    league_id: string,
    leagues: { [key: string]: League },
    allplayers: { [key: string]: Allplayer },
    fpseason: { [key: string]: { [key: string]: number } },
    week: number
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: "SYNC_LEAGUE_START", payload: league_id });

    try {
      const response: { data: League } = await axios.get("/api/syncleague", {
        params: {
          league_id: league_id,
          roster_id: leagues[league_id].userRoster.roster_id,
          week: week,
        },
      });

      const league = response.data;

      const updated_leagues_obj = {
        ...leagues,
        [league_id]: {
          ...leagues[league_id],
          ...response.data,
          rosters: response.data.rosters.map((r) => {
            const { starters, proj_ros_s, proj_ros_t } = getOptimalStarters(
              { players: r.players || [] },
              league.roster_positions,
              fpseason,
              allplayers,
              league.scoring_settings
            );

            return {
              ...r,
              starters: starters,
              proj_ros_s,
              proj_ros_t,
            };
          }),
        },
      };

      const { playershares, leaguemates } = getPlayerShares(
        Object.values(updated_leagues_obj)
      );

      dispatch({
        type: "SYNC_LEAGUE_END",
        payload: {
          leagues: updated_leagues_obj,
          playershares: playershares,
          leaguemates: leaguemates,
        },
      });

      dispatch;
    } catch (err: any) {
      console.log({ err });
      dispatch({
        type: "SYNC_LEAGUE_ERROR",
        payload: err.message,
      });
    }
  };

export const fetchMatchups =
  (
    leagues: { [key: string]: League },
    week: number,
    allplayers: { [key: string]: Allplayer },
    fpweek: { [key: string]: PlayerProjection }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_MATCHUPS_START",
    });

    const league_ids = Object.keys(leagues);

    try {
      const response: { data: Matchup[] } = await axios.post("/api/matchups", {
        league_ids,
        week,
      });

      const matchups_obj: {
        [league_id: string]: {
          user: MatchupOptimal;
          opp: MatchupOptimal;
          median?: number;
          league_matchups: Matchup[];
        };
      } = {};

      const matchup_league_ids = Array.from(
        new Set(response.data.map((matchup) => matchup.league_id))
      );

      matchup_league_ids.forEach((league_id) => {
        const league_matchups = response.data.filter(
          (matchup) => matchup.league_id === league_id
        );

        const user_matchup = league_matchups.find(
          (matchup) =>
            matchup.roster_id === leagues[league_id].userRoster.roster_id
        );

        const opp_matchup = league_matchups.find(
          (matchup) =>
            matchup.matchup_id === user_matchup?.matchup_id &&
            matchup.roster_id !== user_matchup.roster_id
        );

        if (user_matchup && opp_matchup) {
          const u = getOptimalStartersMatchup(
            user_matchup,
            leagues[user_matchup.league_id].roster_positions,
            fpweek,
            allplayers,
            leagues[user_matchup.league_id].scoring_settings,
            leagues[user_matchup.league_id].settings.best_ball
          );

          const o = getOptimalStartersMatchup(
            opp_matchup,
            leagues[opp_matchup.league_id].roster_positions,
            fpweek,

            allplayers,
            leagues[opp_matchup.league_id].scoring_settings,
            leagues[opp_matchup.league_id].settings.best_ball
          );

          const scores =
            leagues[league_id].settings.best_ball === 1
              ? [u.optimal_proj, o.optimal_proj]
              : [u.actual_proj, o.actual_proj];

          let median;
          if (leagues[league_id].settings.league_average_match === 1) {
            league_matchups
              .filter(
                (m) =>
                  ![user_matchup.roster_id, opp_matchup.roster_id].includes(
                    m.roster_id
                  )
              )
              .forEach((m) => {
                const { actual_proj, optimal_proj } = getOptimalStartersMatchup(
                  m,
                  leagues[league_id].roster_positions,
                  fpweek,
                  allplayers,
                  leagues[league_id].scoring_settings,
                  leagues[league_id].settings.best_ball
                );
                leagues[league_id].settings.best_ball === 1
                  ? scores.push(optimal_proj)
                  : scores.push(actual_proj);
              });

            const scores_sorted = scores.sort((a, b) => a - b);

            const middle = Math.floor(scores.length / 2);

            median = (scores_sorted[middle - 1] + scores_sorted[middle]) / 2;
          }

          matchups_obj[league_id] = {
            user: {
              ...user_matchup,
              starters:
                leagues[league_id].settings.best_ball === 1
                  ? u.optimal_starters.map((os) => os.player_id)
                  : user_matchup.starters,
              optimal_starters: u.optimal_starters,
              optimal_proj: u.optimal_proj,
              actual_proj:
                leagues[league_id].settings.best_ball === 1
                  ? u.optimal_proj
                  : u.actual_proj,
              players_projections: u.players_projections,
            },
            opp: {
              ...opp_matchup,
              starters:
                leagues[league_id].settings.best_ball === 1
                  ? o.optimal_starters.map((os) => os.player_id)
                  : opp_matchup.starters,
              optimal_starters: o.optimal_starters,
              optimal_proj: o.optimal_proj,
              actual_proj:
                leagues[league_id].settings.best_ball === 1
                  ? o.optimal_proj
                  : o.actual_proj,
              players_projections: o.players_projections,
            },
            median,
            league_matchups,
          };
        }
      });

      dispatch({
        type: "FETCH_MATCHUPS_END",
        payload: matchups_obj,
      });
    } catch (err: any) {
      console.log({ err });
      console.log("FETCH MATCHUPS");
      dispatch({
        type: "FETCH_MATCHUPS_ERROR",
        payload: err.message,
      });
    }
  };

export const syncMatchup =
  (
    league_id: string,
    leagues: { [key: string]: League },
    week: number,
    allplayers: { [key: string]: Allplayer },
    fpweek: { [key: string]: PlayerProjection }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "SYNC_MATCHUP_START",
      payload: league_id,
    });

    try {
      const response: { data: Matchup[] } = await axios.get(
        "/api/syncmatchup",
        {
          params: {
            league_id,
            week,
          },
        }
      );

      const user_matchup = response.data.find(
        (matchup) =>
          matchup.roster_id === leagues[league_id].userRoster.roster_id
      );

      const opp_matchup = response.data.find(
        (matchup) =>
          matchup.matchup_id === user_matchup?.matchup_id &&
          matchup.roster_id !== user_matchup.roster_id
      );

      let league_matchups;
      if (user_matchup && opp_matchup) {
        const u = getOptimalStartersMatchup(
          user_matchup,
          leagues[league_id].roster_positions,
          fpweek,
          allplayers,
          leagues[league_id].scoring_settings,
          leagues[league_id].settings.best_ball
        );

        const o = getOptimalStartersMatchup(
          opp_matchup,
          leagues[league_id].roster_positions,
          fpweek,
          allplayers,
          leagues[league_id].scoring_settings,
          leagues[league_id].settings.best_ball
        );

        const scores =
          leagues[league_id].settings.best_ball === 1
            ? [u.optimal_proj, o.optimal_proj]
            : [u.actual_proj, o.actual_proj];

        let median;
        if (leagues[league_id].settings.league_average_match === 1) {
          response.data
            .filter(
              (m) =>
                ![user_matchup.roster_id, opp_matchup.roster_id].includes(
                  m.roster_id
                )
            )
            .forEach((m) => {
              const { actual_proj, optimal_proj } = getOptimalStartersMatchup(
                m,
                leagues[league_id].roster_positions,
                fpweek,
                allplayers,
                leagues[league_id].scoring_settings,
                leagues[league_id].settings.best_ball
              );

              leagues[league_id].settings.best_ball === 1
                ? scores.push(optimal_proj)
                : scores.push(actual_proj);
            });

          const scores_sorted = scores.sort((a, b) => a - b);

          const middle = Math.floor(scores.length / 2);

          median = (scores_sorted[middle - 1] + scores_sorted[middle]) / 2;
        }
        league_matchups = {
          user: {
            ...user_matchup,
            starters:
              leagues[league_id].settings.best_ball === 1
                ? u.optimal_starters.map((os) => os.player_id)
                : user_matchup.starters,
            optimal_starters: u.optimal_starters,
            optimal_proj: u.optimal_proj,
            actual_proj:
              leagues[league_id].settings.best_ball === 1
                ? u.optimal_proj
                : u.actual_proj,
            players_projections: u.players_projections,
          },
          opp: {
            ...opp_matchup,
            starters:
              leagues[league_id].settings.best_ball === 1
                ? o.optimal_starters.map((os) => os.player_id)
                : opp_matchup.starters,
            optimal_starters: o.optimal_starters,
            optimal_proj: o.optimal_proj,
            actual_proj:
              leagues[league_id].settings.best_ball === 1
                ? o.optimal_proj
                : o.actual_proj,
            players_projections: o.players_projections,
          },
          median,
          league_matchups: response.data,
        };
      }

      dispatch({
        type: "SYNC_MATCHUP_END",
        payload: {
          matchups: league_matchups,
          league_id,
        },
      });
    } catch (err: any) {
      dispatch({
        type: "SYNC_MATCHUP_ERROR",
        payload: err.message,
      });
    }
  };

export const fetchLiveStats =
  (
    allplayers: { [key: string]: Allplayer },
    week: number,
    leagues: { [key: string]: League },
    matchups: {
      [key: string]: {
        user: MatchupOptimal;
        opp: MatchupOptimal;
        median?: number;
        league_matchups: Matchup[];
      };
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response: {
        data: {
          data: {
            player_id: string;
            stats: { [key: string]: number };
            proj_remaining: { [key: string]: number };
            percent_game_left: number;
          }[];
          updateAt: number;
        };
      } = await axios.get("/api/livestats", {
        params: { week },
      });

      const live_stats_obj = Object.fromEntries(
        response.data.data.map((player_stat) => [
          player_stat.player_id,
          player_stat.stats,
        ])
      );

      const live_proj_obj = Object.fromEntries(
        response.data.data.map((player_stat) => [
          player_stat.player_id,
          player_stat.proj_remaining,
        ])
      );

      const combined_stats_proj_obj = Object.fromEntries(
        [...Object.keys(live_stats_obj), ...Object.keys(live_proj_obj)].map(
          (player_id) => [
            player_id,
            Object.fromEntries(
              [
                ...Object.keys(live_stats_obj[player_id] || {}),
                ...Object.keys(live_proj_obj[player_id] || {}),
              ].map((cat) => [
                cat,
                (live_stats_obj[player_id]?.[cat] || 0) +
                  (live_proj_obj[player_id]?.[cat] || 0),
              ])
            ),
          ]
        )
      );

      const live_matchups: {
        [key: string]: {
          user: {
            points_total: number;
            proj_remaining_total: number;
            players_points: { [player_id: string]: number };
            players_proj_remaining: { [player_id: string]: number };
          };
          opp: {
            points_total: number;
            proj_remaining_total: number;
            players_points: { [player_id: string]: number };
            players_proj_remaining: { [player_id: string]: number };
          };
          median: {
            current: number | undefined;
            projected: number | undefined;
          };
        };
      } = {};

      Object.keys(matchups).forEach((league_id) => {
        let user_starters;
        let opp_starters;

        if (leagues[league_id].settings.best_ball === 1) {
          const optimal_starters_user = getOptimalStarters(
            { players: matchups[league_id].user.players },
            leagues[league_id].roster_positions,
            combined_stats_proj_obj,
            allplayers,
            leagues[league_id].scoring_settings
          );

          user_starters = optimal_starters_user.starters;

          const optimal_starters_opp = getOptimalStarters(
            { players: matchups[league_id].opp.players },
            leagues[league_id].roster_positions,
            combined_stats_proj_obj,
            allplayers,
            leagues[league_id].scoring_settings
          );

          opp_starters = optimal_starters_opp.starters;
        } else {
          user_starters = matchups[league_id].user.starters;
          opp_starters = matchups[league_id].opp.starters;
        }

        const players_points_user = Object.fromEntries(
          matchups[league_id].user.players.map((player_id) => [
            player_id,
            getPlayerProjection(
              player_id,
              leagues[league_id].scoring_settings,
              live_stats_obj
            ),
          ])
        );
        const players_proj_remaining_user = Object.fromEntries(
          matchups[league_id].user.players.map((player_id) => [
            player_id,
            getPlayerProjection(
              player_id,
              leagues[league_id].scoring_settings,
              live_proj_obj
            ),
          ])
        );

        const players_points_opp = Object.fromEntries(
          matchups[league_id].opp.players.map((player_id) => [
            player_id,
            getPlayerProjection(
              player_id,
              leagues[league_id].scoring_settings,
              live_stats_obj
            ),
          ])
        );
        const players_proj_remaining_opp = Object.fromEntries(
          matchups[league_id].opp.players.map((player_id) => [
            player_id,
            getPlayerProjection(
              player_id,
              leagues[league_id].scoring_settings,
              live_proj_obj
            ),
          ])
        );

        const user_points_total = user_starters.reduce(
          (acc, cur) => acc + (players_points_user[cur] || 0),
          0
        );
        const user_proj_remaining_total = user_starters.reduce(
          (acc, cur) =>
            acc +
            (players_proj_remaining_user[cur] || 0) +
            (players_points_user[cur] || 0),
          0
        );

        const opp_points_total = opp_starters.reduce(
          (acc, cur) => acc + (players_points_opp[cur] || 0),
          0
        );

        const opp_proj_remaining_total = opp_starters.reduce(
          (acc, cur) =>
            acc +
            (players_proj_remaining_opp[cur] || 0) +
            (players_points_opp[cur] || 0),
          0
        );

        let median_cur;
        let median_proj;
        if (matchups[league_id].median !== undefined) {
          const scores_cur = [user_points_total, opp_points_total];
          const scores_proj = [
            user_proj_remaining_total,
            opp_proj_remaining_total,
          ];

          matchups[league_id].league_matchups
            .filter(
              (m) =>
                ![
                  matchups[league_id].user.roster_id,
                  matchups[league_id].opp.roster_id,
                ].includes(m.roster_id)
            )
            .forEach((m) => {
              let lm_starters;

              if (leagues[league_id].settings.best_ball === 1) {
                const lm_optimal = getOptimalStarters(
                  { players: m.players || [] },
                  leagues[league_id].roster_positions,
                  combined_stats_proj_obj,
                  allplayers,
                  leagues[league_id].scoring_settings
                );

                lm_starters = lm_optimal.starters;
              } else {
                lm_starters = m.starters;
              }

              const lm_cur = lm_starters.reduce(
                (acc, cur) =>
                  acc +
                  getPlayerProjection(
                    cur,
                    leagues[league_id].scoring_settings,
                    live_stats_obj
                  ),
                0
              );
              const lm_proj = lm_starters.reduce(
                (acc, cur) =>
                  acc +
                  (getPlayerProjection(
                    cur,
                    leagues[league_id].scoring_settings,
                    live_proj_obj
                  ) || 0) +
                  (getPlayerProjection(
                    cur,
                    leagues[league_id].scoring_settings,
                    live_stats_obj
                  ) || 0),
                0
              );

              scores_cur.push(lm_cur);
              scores_proj.push(lm_proj);
            });

          const scores_sorted_cur = scores_cur.sort((a, b) => a - b);
          const scores_sorted_proj = scores_proj.sort((a, b) => a - b);

          const middle_cur = Math.floor(scores_cur.length / 2);
          const middle_proj = Math.floor(scores_proj.length / 2);

          median_cur =
            (scores_sorted_cur[middle_cur - 1] +
              scores_sorted_cur[middle_cur]) /
            2;
          median_proj =
            (scores_sorted_proj[middle_proj - 1] +
              scores_sorted_proj[middle_proj]) /
            2;
        }

        live_matchups[league_id] = {
          user: {
            points_total: user_points_total,
            proj_remaining_total: user_proj_remaining_total,
            players_points: players_points_user,
            players_proj_remaining: players_proj_remaining_user,
          },
          opp: {
            points_total: opp_points_total,
            proj_remaining_total: opp_proj_remaining_total,
            players_points: players_points_opp,
            players_proj_remaining: players_proj_remaining_opp,
          },
          median: {
            current: median_cur,
            projected: median_proj,
          },
        };
      });

      console.log({ live_matchups });
      dispatch({
        type: "SET_LIVE_STATS",
        payload: { live: live_matchups, updateAt: response.data.updateAt },
      });
    } catch (err: any) {
      console.log({ err });
    }
  };

export const fetchLmTrades =
  (
    leaguemate_ids: string[],
    offset: number,
    limit: number,
    leagues: { [key: string]: League },
    fpseason: { [key: string]: { [key: string]: number } },
    allplayers: { [key: string]: Allplayer }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_LMTRADES_START",
    });

    try {
      const response: { data: { count: string; rows: Trade[] } } =
        await axios.post("/api/lmtrades", {
          leaguemate_ids,
          limit,
          offset,
        });

      const trades_w_tips = getTradeTips(
        response.data.rows,
        leagues,
        fpseason,
        allplayers
      );

      dispatch({
        type: "SET_STATE_LMTRADES",
        payload: {
          count: parseInt(response.data.count),
          trades: trades_w_tips,
        },
      });
    } catch (err: any) {
      console.log({ err });
      dispatch({
        type: "FETCH_LMTRADES_ERROR",
        payload: err.message,
      });
    }
  };

export const fetchFilteredLmTrades =
  (
    leaguemate_ids: string[],
    offset: number,
    limit: number,
    leagues: { [key: string]: League },
    manager: string | false,
    player: string | false,
    fpseason: { [key: string]: { [key: string]: number } },
    allplayers: { [key: string]: Allplayer }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_LMTRADES_START",
    });

    try {
      const response: {
        data: {
          manager: string | false;
          player: string | false;
          count: number;
          rows: Trade[];
        };
      } = await axios.post("/api/lmtrades", {
        leaguemate_ids,
        limit,
        offset,
        manager,
        player,
      });

      const trades_w_tips = getTradeTips(
        response.data.rows,
        leagues,
        fpseason,
        allplayers
      );

      dispatch({
        type: "FETCH_FILTERED_LMTRADES_END",
        payload: {
          manager: response.data.manager,
          player: response.data.player,
          count: response.data.count,
          trades: trades_w_tips,
        },
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };
