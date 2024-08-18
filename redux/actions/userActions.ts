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
} from "@/lib/types";
import {
  getOptimalStarters,
  getOptimalStartersMatchup,
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
  payload: { [key: string]: MatchupOptimal[] };
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
    matchups: MatchupOptimal[];
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
                  r,
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
    fpseason: { [key: string]: { [key: string]: number } }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: "SYNC_LEAGUE_START", payload: league_id });

    try {
      const response: { data: League } = await axios.get("/api/syncleague", {
        params: {
          league_id: league_id,
          roster_id: leagues[league_id].userRoster.roster_id,
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
              r,
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

      const matchups_obj: { [key: string]: MatchupOptimal[] } = {};

      response.data.forEach((matchup) => {
        if (!matchups_obj[matchup.league_id]) {
          matchups_obj[matchup.league_id] = [];
        }

        const {
          optimal_starters,
          optimal_proj,
          actual_proj,
          players_projections,
        } = getOptimalStartersMatchup(
          matchup,
          leagues[matchup.league_id].roster_positions,
          fpweek,
          allplayers,
          leagues[matchup.league_id].scoring_settings
        );
        matchups_obj[matchup.league_id].push({
          ...matchup,
          starters:
            leagues[matchup.league_id].settings.best_ball === 1
              ? optimal_starters
              : matchup.starters,
          optimal_starters,
          optimal_proj,
          actual_proj:
            leagues[matchup.league_id].settings.best_ball === 1
              ? optimal_proj
              : actual_proj,
          players_projections,
        });
      });

      dispatch({
        type: "FETCH_MATCHUPS_END",
        payload: matchups_obj,
      });
    } catch (err: any) {
      console.log({ err });
      dispatch({ type: "FETCH_MATCHUPS_ERROR", payload: err.message });
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

      const league_matchups: MatchupOptimal[] = [];

      response.data.forEach((matchup) => {
        const {
          optimal_starters,
          optimal_proj,
          actual_proj,
          players_projections,
        } = getOptimalStartersMatchup(
          matchup,
          leagues[league_id].roster_positions,
          fpweek,
          allplayers,
          leagues[league_id].scoring_settings
        );

        league_matchups.push({
          ...matchup,
          starters:
            leagues[league_id].settings.best_ball === 1
              ? optimal_starters
              : matchup.starters,
          optimal_starters,
          optimal_proj,
          actual_proj,
          players_projections,
        });
      });

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

export const fetchLmTrades =
  (
    leaguemate_ids: string[],
    offset: number,
    limit: number,
    leagues: { [key: string]: League }
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

      const trades_w_tips = getTradeTips(response.data.rows, leagues);

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
    player: string | false
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

      const trades_w_tips = getTradeTips(response.data.rows, leagues);

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
