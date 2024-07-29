import { produce, WritableDraft } from "immer";
import { League } from "@/lib/types";
import { LeaguesActionTypes } from "../actions/leaguesActions";

export interface LeagueState {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  activeLeague: string | false;
  sortLeaguesBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  searchedLeague: string | false;
  standingsColumn: string;
  standingsTab: string;
  standingsTab2: string;
  teamColumn: string;
  page: number;
}

const initialState: LeagueState = {
  column1: "S Proj Rk",
  column2: "S KTC Rk",
  column3: "T Proj Rk",
  column4: "S Proj Rk",
  activeLeague: false,
  sortLeaguesBy: {
    column: 0,
    asc: false,
  },
  searchedLeague: false,
  standingsColumn: "S Proj",
  standingsTab: "Standings",
  standingsTab2: "",
  teamColumn: "Proj",
  page: 1,
};

const leaguesReducer = (state = initialState, action: LeaguesActionTypes) => {
  return produce(state, (draft: WritableDraft<LeagueState>) => {
    switch (action.type) {
      case "SET_LEAGUES_COLUMN":
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
      case "SET_ACTIVE_LEAGUE":
        draft.activeLeague = action.payload;
        break;
      case "SET_STANDINGS_COLUMN":
        draft.standingsColumn = action.payload;
        break;

      case "SET_TEAM_COLUMN":
        draft.teamColumn = action.payload;
        break;

      case "SET_SORT_LEAGUES":
        draft.sortLeaguesBy = {
          column: action.payload.col,
          asc: action.payload.asc,
        };
        break;

      case "SET_SEARCHED_LEAGUE":
        draft.searchedLeague = action.payload;
        break;

      case "SET_LEAGUES_PAGE":
        draft.page = action.payload;
        break;

      case "SET_STANDINGS_TAB":
        draft.standingsTab = action.payload;
        break;

      case "SET_STANDINGS_TAB2":
        draft.standingsTab2 = action.payload;
        break;

      default:
        break;
    }
  });
};

export default leaguesReducer;
