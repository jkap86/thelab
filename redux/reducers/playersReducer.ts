import { PlayersActionTypes } from "../actions/playersActions";

export interface PlayersState {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  sortPlayersBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  searchedPlayer: string | false;
  activePlayer: string | false;
  activePlayerLeague: string | false;
  detailTab: string;
  ownedColumn1: string;
  ownedColumn2: string;
  ownedColumn3: string;
  ownedColumn4: string;
  sortOwnedBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  takenColumn3: string;
  takenColumn4: string;
  sortTakenBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  availableColumn1: string;
  availableColumn2: string;
  availableColumn3: string;
  availableColumn4: string;
  sortAvailableBy: {
    column: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
  page: number;
  page_owned: number;
  page_taken: number;
  page_available: number;
  filterTeam: string;
  filterDraftYear: string;
  filterPosition: string;
}

const initialState: PlayersState = {
  column1: "# Own",
  column2: "KTC",
  column3: "KTC 7",
  column4: "KTC 30",
  sortPlayersBy: {
    column: 1,
    asc: false,
  },
  searchedPlayer: false,
  activePlayer: false,
  activePlayerLeague: false,
  detailTab: "Owned",
  ownedColumn1: "Rank",
  ownedColumn2: "Pts Rank",
  ownedColumn3: "S KTC Rk",
  ownedColumn4: "T KTC Rk",
  sortOwnedBy: {
    column: 0,
    asc: false,
  },
  takenColumn3: "Rank",
  takenColumn4: "Lm Rank",
  sortTakenBy: {
    column: 0,
    asc: false,
  },
  availableColumn1: "Rank",
  availableColumn2: "Pts Rank",
  availableColumn3: "S KTC Rk",
  availableColumn4: "T KTC Rk",
  sortAvailableBy: {
    column: 0,
    asc: false,
  },
  page: 1,
  page_owned: 1,
  page_taken: 1,
  page_available: 1,
  filterTeam: "All",
  filterDraftYear: "All",
  filterPosition: "All",
};

const playersReducer = (state = initialState, action: PlayersActionTypes) => {
  switch (action.type) {
    case "SET_PLAYERS_COLUMN":
      return {
        ...state,
        [`column${action.payload.col}`]: action.payload.value,
      };
    case "SET_SORT_PLAYERS":
      return {
        ...state,
        sortPlayersBy: {
          column: action.payload.col,
          asc: action.payload.asc,
        },
      };
    case "SET_PLAYERS_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_ACTIVE_PLAYERS":
      return {
        ...state,
        activePlayer: action.payload,
      };
    case "SET_DETAIL_COLUMN":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "SET_SEARCHED_PLAYER":
      return {
        ...state,
        searchedPlayer: action.payload,
      };
    case "SET_PLAYERS_DETAIL_TAB":
      return {
        ...state,
        detailTab: action.payload,
      };
    case "SET_SORT_OWNED":
      return {
        ...state,
        sortOwnedBy: {
          column: action.payload.col,
          asc: action.payload.asc,
        },
      };
    case "SET_SORT_TAKEN":
      return {
        ...state,
        sortTakenBy: {
          column: action.payload.col,
          asc: action.payload.asc,
        },
      };
    case "SET_SORT_AVAILABLE":
      return {
        ...state,
        sortAvailableBy: {
          column: action.payload.col,
          asc: action.payload.asc,
        },
      };
    case "SET_ACTIVE_PLAYER_LEAGUE":
      return {
        ...state,
        activePlayerLeague: action.payload,
      };
    case "SET_PLAYERS_OWNED_PAGE":
      return {
        ...state,
        page_owned: action.payload,
      };
    case "SET_PLAYERS_TAKEN_PAGE":
      return {
        ...state,
        page_taken: action.payload,
      };
    case "SET_PLAYERS_AVAILABLE_PAGE":
      return {
        ...state,
        page_available: action.payload,
      };
    case "SET_FILTER_TEAM":
      return {
        ...state,
        filterTeam: action.payload,
      };
    case "SET_FILTER_DRAFTCLASS":
      return {
        ...state,
        filterDraftYear: action.payload,
      };
    case "SET_FILTER_POSITION":
      return {
        ...state,
        filterPosition: action.payload,
      };
    default:
      return state;
  }
};

export default playersReducer;
