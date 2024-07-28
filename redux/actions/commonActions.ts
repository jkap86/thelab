import axios from "axios";
import { Allplayer } from "@/lib/types";
import { AppDispatch } from "../store";

interface fetchAllplayersStartAction {
  type: "FETCH_ALLPLAYERS_START";
}

interface setStateAllplayersAction {
  type: "SET_STATE_ALLPLAYERS";
  payload: { [key: string]: Allplayer };
}

interface fetchAllplayersErrorAction {
  type: "FETCH_ALLPLAYERS_ERROR";
  payload: Error;
}

interface setKTC_datesAction {
  type: "SET_KTC_DATES";
  payload: {
    [key: string]: number;
  };
}

interface setFpSeason {
  type: "SET_FP_SEASON";
  payload: {
    [key: string]: { [key: string]: number };
  };
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
  | setKTC_datesAction
  | setFpSeason
  | setType1Action
  | setType2Action;

export const fetchAllPlayers = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: "FETCH_ALLPLAYERS_START",
  });

  try {
    const response: { data: Allplayer[] } = await axios.get("/api/allplayers");

    const allplayers_obj: { [key: string]: Allplayer } = {};

    response.data.forEach((player_obj) => {
      allplayers_obj[player_obj.player_id] = player_obj;
    });

    dispatch({
      type: "SET_STATE_ALLPLAYERS",
      payload: allplayers_obj,
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
  try {
    const response: { data: { date: string; values: string[][] } } =
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}ktc/current`);

    dispatch({
      type: "SET_KTC_DATES",
      payload: Object.fromEntries(response.data.values),
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchFpSeason = () => async (dispatch: AppDispatch) => {
  try {
    const response: {
      data: { player_id: string; stats: { [key: string]: number } }[];
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
