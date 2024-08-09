import { produce, WritableDraft } from "immer";
import { Allplayer, SleeperState } from "@/lib/types";
import { CommonActionTypes } from "../actions/commonActions";

export interface CommonState {
  state: SleeperState | false;
  allplayers: { [key: string]: Allplayer } | false;
  isLoadingAllplayers: boolean;
  errorAllplayers: Error | false;
  ktc_current:
    | {
        [key: string]: number;
      }
    | false;
  isLoadingKTC: boolean;
  fpseason: { [key: string]: { [key: string]: number } } | false;
  isLoadingFpSeason: boolean;
  type1: "Redraft" | "All" | "Dynasty";
  type2: "Bestball" | "All" | "Lineup";
}
const initialState: CommonState = {
  state: false,
  allplayers: false,
  isLoadingAllplayers: false,
  errorAllplayers: false,
  ktc_current: false,
  isLoadingKTC: false,
  fpseason: false,
  isLoadingFpSeason: false,
  type1: "All",
  type2: "All",
};

const commonReducer = (state = initialState, action: CommonActionTypes) => {
  return produce(state, (draft: WritableDraft<CommonState>) => {
    switch (action.type) {
      case "FETCH_ALLPLAYERS_START":
        draft.isLoadingAllplayers = true;
        break;
      case "SET_STATE_ALLPLAYERS":
        draft.allplayers = action.payload.allplayers;
        draft.state = action.payload.state;
        draft.isLoadingAllplayers = false;
        break;
      case "FETCH_ALLPLAYERS_ERROR":
        draft.isLoadingAllplayers = false;
        draft.errorAllplayers = action.payload;
        break;
      case "FETCH_KTC_START":
        draft.isLoadingKTC = true;
        break;
      case "FETCH_KTC_ERROR":
        draft.isLoadingKTC = false;
        break;
      case "SET_KTC_DATES":
        draft.ktc_current = action.payload;
        draft.isLoadingKTC = false;
        break;
      case "FETCH_FPSEASON_START":
        draft.isLoadingFpSeason = true;
        break;
      case "SET_FP_SEASON":
        draft.fpseason = action.payload;
        draft.isLoadingFpSeason = false;
        break;
      case "FETCH_FPSEASON_ERROR":
        draft.isLoadingFpSeason = false;
        break;
      case "SET_COMMON_TYPE1":
        draft.type1 = action.payload;
        break;
      case "SET_COMMON_TYPE2":
        draft.type2 = action.payload;
      default:
        break;
    }
  });
};

export default commonReducer;
