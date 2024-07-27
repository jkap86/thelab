import { produce, WritableDraft } from "immer";
import { Allplayer } from "@/lib/types";
import { CommonActionTypes } from "../actions/commonActions";

export interface CommonState {
  allplayers: { [key: string]: Allplayer } | false;
  isLoadingAllplayers: boolean;
  errorAllplayers: Error | false;
  ktc_current:
    | {
        [key: string]: number;
      }
    | false;
  fpseason: { [key: string]: { [key: string]: number } } | false;
  type1: "Redraft" | "All" | "Dynasty";
  type2: "Bestball" | "All" | "Lineup";
}
const initialState: CommonState = {
  allplayers: false,
  isLoadingAllplayers: false,
  errorAllplayers: false,
  ktc_current: false,
  fpseason: false,
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
        draft.allplayers = action.payload;
        draft.isLoadingAllplayers = false;
        break;
      case "FETCH_ALLPLAYERS_ERROR":
        draft.errorAllplayers = action.payload;
        break;
      case "SET_KTC_DATES":
        draft.ktc_current = action.payload;
        break;
      case "SET_FP_SEASON":
        draft.fpseason = action.payload;
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
