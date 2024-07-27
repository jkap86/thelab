import { Allplayer } from "@/lib/types";

interface setPlayersColumnAction {
  type: "SET_PLAYERS_COLUMN";
  payload: {
    col: 1 | 2 | 3 | 4;
    value: string;
  };
}

interface setSortPlayersByAction {
  type: "SET_SORT_PLAYERS";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

interface setSortOwnedByAction {
  type: "SET_SORT_OWNED";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

interface setSearchedPlayerAction {
  type: "SET_SEARCHED_PLAYER";
  payload: string | false;
}

interface setActivePlayerAction {
  type: "SET_ACTIVE_PLAYERS";
  payload: string;
}

interface setPlayersPageAction {
  type: "SET_PLAYERS_PAGE";
  payload: number;
}

interface setPlayersDetailTabAction {
  type: "SET_PLAYERS_DETAIL_TAB";
  payload: string;
}

interface setDetailColumnAction {
  type: "SET_DETAIL_COLUMN";
  payload: {
    key: string;
    value: string;
  };
}

export type PlayersActionTypes =
  | setPlayersColumnAction
  | setSortPlayersByAction
  | setSearchedPlayerAction
  | setActivePlayerAction
  | setPlayersPageAction
  | setDetailColumnAction
  | setPlayersDetailTabAction
  | setSortOwnedByAction;

export const setPlayersColumn = (
  col: 1 | 2 | 3 | 4,
  value: string
): setPlayersColumnAction => ({
  type: "SET_PLAYERS_COLUMN",
  payload: {
    col: col,
    value: value,
  },
});

export const setSortPlayersBy = (
  col: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortPlayersByAction => ({
  type: "SET_SORT_PLAYERS",
  payload: {
    col: col,
    asc: asc,
  },
});

export const setSortOwnedBy = (
  col: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortOwnedByAction => ({
  type: "SET_SORT_OWNED",
  payload: {
    col: col,
    asc: asc,
  },
});

export const setSearchedPlayer = (
  player_id: string | false
): setSearchedPlayerAction => ({
  type: "SET_SEARCHED_PLAYER",
  payload: player_id,
});

export const setActivePlayer = (player_id: string): setActivePlayerAction => ({
  type: "SET_ACTIVE_PLAYERS",
  payload: player_id,
});

export const setPlayersPage = (page: number): setPlayersPageAction => ({
  type: "SET_PLAYERS_PAGE",
  payload: page,
});

export const setPlayersDetailTab = (
  tab: string
): setPlayersDetailTabAction => ({
  type: "SET_PLAYERS_DETAIL_TAB",
  payload: tab,
});

export const setDetailColumn = (
  key: string,
  value: string
): setDetailColumnAction => ({
  type: "SET_DETAIL_COLUMN",
  payload: { key, value },
});
