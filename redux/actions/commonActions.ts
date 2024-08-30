import axios from "axios";
import {
  Allplayer,
  PlayerProjection,
  PlayerStat,
  SleeperState,
} from "@/lib/types";
import { AppDispatch } from "../store";

interface fetchAllplayersStartAction {
  type: "FETCH_ALLPLAYERS_START";
}

interface setStateAllplayersAction {
  type: "SET_STATE_ALLPLAYERS";
  payload: {
    allplayers: { [key: string]: Allplayer };
    state: SleeperState;
  };
}

interface fetchAllplayersErrorAction {
  type: "FETCH_ALLPLAYERS_ERROR";
  payload: Error;
}

interface fetchKtcStartAction {
  type: "FETCH_KTC_START";
}

interface setKTC_datesAction {
  type: "SET_KTC_DATES";
  payload: {
    [key: string]: number;
  };
}

interface fetchKtcErrorAction {
  type: "FETCH_KTC_ERROR";
}

interface fetchFpSeasonStartAction {
  type: "FETCH_FPSEASON_START";
}

interface setFpSeasonAction {
  type: "SET_FP_SEASON";
  payload: {
    [key: string]: { [key: string]: number };
  };
}

interface fetchFpSeasonErrorAction {
  type: "FETCH_FPSEASON_ERROR";
}

interface fetchFpWeekStartAction {
  type: "FETCH_FPWEEK_START";
}

interface setFpWeekAction {
  type: "SET_FP_WEEK";
  payload: {
    [key: string]: PlayerProjection;
  };
}

interface fetchFpWeekErrorAction {
  type: "FETCH_FPWEEK_ERROR";
}

interface setType1Action {
  type: "SET_COMMON_TYPE1";
  payload: "Redraft" | "All" | "Dynasty";
}

interface setType2Action {
  type: "SET_COMMON_TYPE2";
  payload: "Bestball" | "All" | "Lineup";
}

export type CommonActionTypes =
  | fetchAllplayersStartAction
  | setStateAllplayersAction
  | fetchAllplayersErrorAction
  | fetchKtcStartAction
  | setKTC_datesAction
  | fetchKtcErrorAction
  | fetchFpSeasonStartAction
  | setFpSeasonAction
  | fetchFpSeasonErrorAction
  | fetchFpWeekStartAction
  | setFpWeekAction
  | fetchFpWeekErrorAction
  | setType1Action
  | setType2Action;

export const fetchAllPlayers = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: "FETCH_ALLPLAYERS_START",
  });

  try {
    const response: {
      data: {
        allplayers: Allplayer[];
        state: { [key: string]: string | number };
      };
    } = await axios.get("/api/allplayers");

    const allplayers_obj: { [key: string]: Allplayer } = {};

    response.data.allplayers.forEach((player_obj) => {
      allplayers_obj[player_obj.player_id] = player_obj;
    });

    dispatch({
      type: "SET_STATE_ALLPLAYERS",
      payload: {
        allplayers: allplayers_obj,
        state: response.data.state,
      },
    });
  } catch (err: any) {
    console.log({ err });
    dispatch({
      type: "FETCH_ALLPLAYERS_ERROR",
      payload: err,
    });
  }
};

export const fetchKTC_dates = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: "FETCH_KTC_START",
  });
  try {
    const response: { data: { date: string; values: string[][] } } =
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ktc/current`);

    dispatch({
      type: "SET_KTC_DATES",
      payload: Object.fromEntries(response.data.values),
    });
  } catch (err: any) {
    console.log({ err });
    dispatch({ type: "FETCH_KTC_ERROR" });
  }
};

export const fetchFpSeason = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: "FETCH_FPSEASON_START",
  });
  try {
    const response: {
      data: PlayerStat[];
    } = await axios.get(`/api/fpseason`);

    dispatch({
      type: "SET_FP_SEASON",
      payload: Object.fromEntries(
        response.data.map((player_stat) => [
          player_stat.player_id,
          player_stat.stats,
        ])
      ),
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "FETCH_FPSEASON_ERROR",
    });
  }
};

export const fetchFpWeek = (week: number) => async (dispatch: AppDispatch) => {
  dispatch({
    type: "FETCH_FPWEEK_START",
  });

  try {
    const response: {
      data: PlayerStat[];
    } = await axios.get("/api/fpweek", {
      params: {
        week,
      },
    });

    dispatch({
      type: "SET_FP_WEEK",
      payload: Object.fromEntries(
        response.data.map((player_stat) => [
          player_stat.player_id,
          {
            projection: player_stat.stats,
            injury_status: player_stat.injury_status,
            kickoff_slot: player_stat.kickoff,
          },
        ])
      ),
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: "FETCH_FPWEEK_ERROR",
    });
  }
};

export const setType1 = (
  value: "Redraft" | "All" | "Dynasty"
): setType1Action => ({
  type: "SET_COMMON_TYPE1",
  payload: value,
});

export const setType2 = (
  value: "Bestball" | "All" | "Lineup"
): setType2Action => ({
  type: "SET_COMMON_TYPE2",
  payload: value,
});
