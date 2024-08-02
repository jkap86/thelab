import { produce, WritableDraft } from "immer";
import { LeaguematesActionTypes } from "../actions/leaguematesActions";

export interface LeaguematesState {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  sortLmBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  page: number;
}

const initialState: LeaguematesState = {
  column1: "# C L",
  column2: "Wins",
  column3: "Losses",
  column4: "FP",
  sortLmBy: {
    column: 1,
    asc: false,
  },
  page: 1,
};

const LeaguematesReducer = (
  state = initialState,
  action: LeaguematesActionTypes
) => {
  return produce(state, (draft: WritableDraft<LeaguematesState>) => {
    switch (action.type) {
      case "SET_LM_COLUMN":
        switch (action.payload.col) {
          case 1:
            draft.column1 = action.payload.value;
            break;
          case 2:
            draft.column2 = action.payload.value;
            break;
          case 3:
            draft.column3 = action.payload.value;
            break;
          case 4:
            draft.column4 = action.payload.value;
            break;
          default:
            break;
        }
        break;
      case "SET_LM_PAGE":
        draft.page = action.payload;
        break;
      case "SET_SORT_LM":
        draft.sortLmBy = {
          column: action.payload.col,
          asc: action.payload.asc,
        };
        break;
      default:
        break;
    }
  });
};

export default LeaguematesReducer;
