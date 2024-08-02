import axios from "axios";
import { AppDispatch } from "../store";
import { User, League, Allplayer, Leaguemate } from "@/lib/types";
import { getOptimalStarters, getPlayerShares } from "@/helpers/getPlayerShares";

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
  };
}

interface syncLeagueErrorAction {
  type: "SYNC_LEAGUE_ERROR";
  payload: string;
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
    fpseason: { [key: string]: { [key: string]: number } },
    allplayers: { [key: string]: Allplayer }
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: "FETCH_LEAGUES_START",
    });

    try {
      const response: { data: League[] } = await axios.get("/api/leagues", {
        params: { user_id: user_id },
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

      const updated_playershares = getPlayerShares(
        Object.values(updated_leagues_obj)
      );

      dispatch({
        type: "SYNC_LEAGUE_END",
        payload: {
          leagues: updated_leagues_obj,
          playershares: updated_playershares,
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
