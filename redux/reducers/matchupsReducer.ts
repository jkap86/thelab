import { produce, WritableDraft } from "immer";
import { MatchupActionTypes } from "../actions/matchupsActions";

export interface MatchupsState {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  page: number;
  page_starters: number;
  activeMatchup: string | false;
  activeStarter: string | false;
  searchedStarter: string | false;
  tab: string;
  sortStartersBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  sortLineupcheckBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  secondaryTabStarters: string;
}

const initialState: MatchupsState = {
  column1: "Opt-Act",
  column2: "Mv to FLX",
  column3: "Mv frm FLX",
  column4: "Proj Result",
  page: 1,
  page_starters: 1,
  searchedStarter: false,
  activeMatchup: false,
  activeStarter: false,
  tab: "LineupCheck",
  sortStartersBy: {
    column: 1,
    asc: false,
  },
  sortLineupcheckBy: {
    column: 1,
    asc: false,
  },
  secondaryTabStarters: "Start",
};

const matchupsReducer = (state = initialState, action: MatchupActionTypes) => {
  return produce(state, (draft: WritableDraft<MatchupsState>) => {
    switch (action.type) {
      case "SET_LC_COLUMN":
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
      case "SET_ACTIVE_STARTER":
        draft.activeStarter = action.payload;
        break;
      case "SET_SEARCHED_STARTER":
        draft.searchedStarter = action.payload;
        break;
      case "SET_STARTERS_PAGE":
        draft.page_starters = action.payload;
        break;
      case "SET_SECONDARYTAB_STARTERS":
        draft.secondaryTabStarters = action.payload;
        break;
      default:
        break;
    }
  });
};

export default matchupsReducer;
