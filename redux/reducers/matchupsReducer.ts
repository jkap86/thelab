import { produce, WritableDraft } from "immer";
import { MatchupActionTypes } from "../actions/matchupsActions";

export interface MatchupsState {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  page: number;
  activeMatchup: string | false;
  tab: string;
  sortStartersBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

const initialState: MatchupsState = {
  column1: "S",
  column2: "B",
  column3: "Opp S",
  column4: "Opp B",
  page: 1,
  activeMatchup: false,
  tab: "LineupCheck",
  sortStartersBy: {
    column: 1,
    asc: false,
  },
};

const matchupsReducer = (state = initialState, action: MatchupActionTypes) => {
  return produce(state, (draft: WritableDraft<MatchupsState>) => {
    switch (action.type) {
      case "SET_STARTERS_COLUMN":
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
      case "SET_MATCHUPS_TAB":
        draft.tab = action.payload;
        break;
      case "SET_SORT_STARTERS":
        draft.sortStartersBy = {
          column: action.payload.col,
          asc: action.payload.asc,
        };
        break;
      case "SET_MATCHUPS_PAGE":
        draft.page = action.payload;
        break;
      case "SET_ACTIVE_MATCHUP":
        draft.activeMatchup = action.payload;
        break;
      default:
        break;
    }
  });
};

export default matchupsReducer;
