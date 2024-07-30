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
}

const initialState: PlayersState = {
  column1: "# Own",
  column2: "KTC",
  column3: "Age",
  column4: "# Avail",
  sortPlayersBy: {
    column: 1,
    asc: false,
  },
  searchedPlayer: false,
  activePlayer: false,
  detailTab: "Owned",
  ownedColumn1: "S Proj Rk",
  ownedColumn2: "S KTC Rk",
  ownedColumn3: "T Proj Rk",
  ownedColumn4: "T KTC Rk",
  sortOwnedBy: {
    column: 0,
    asc: false,
  },
  takenColumn3: "Wins",
  takenColumn4: "Lm Wins",
  sortTakenBy: {
    column: 0,
    asc: false,
  },
  availableColumn1: "Wins",
  availableColumn2: "Losses",
  availableColumn3: "FP",
  availableColumn4: "FPA",
  sortAvailableBy: {
    column: 0,
    asc: false,
  },
  page: 1,
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
        sortAvailableBy: {},
      };
    default:
      return state;
  }
};

export default playersReducer;
