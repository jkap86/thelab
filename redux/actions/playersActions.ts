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

interface setSortTakenByAction {
  type: "SET_SORT_TAKEN";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

interface setSortAvailableByAction {
  type: "SET_SORT_AVAILABLE";
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

interface setPlayersOwnedPageAction {
  type: "SET_PLAYERS_OWNED_PAGE";
  payload: number;
}

interface setPlayersTakenPageAction {
  type: "SET_PLAYERS_TAKEN_PAGE";
  payload: number;
}

interface setPlayersAvailablePageAction {
  type: "SET_PLAYERS_AVAILABLE_PAGE";
  payload: number;
}

interface setPlayersDetailTabAction {
  type: "SET_PLAYERS_DETAIL_TAB";
  payload: string;
}

interface setActivePlayerLeagueAction {
  type: "SET_ACTIVE_PLAYER_LEAGUE";
  payload: string;
}

interface setDetailColumnAction {
  type: "SET_DETAIL_COLUMN";
  payload: {
    key: string;
    value: string;
  };
}

interface setFilterTeamAction {
  type: "SET_FILTER_TEAM";
  payload: string;
}

interface setFilterDraftClassAction {
  type: "SET_FILTER_DRAFTCLASS";
  payload: string;
}

interface setFilterPositionAction {
  type: "SET_FILTER_POSITION";
  payload: string;
}

export type PlayersActionTypes =
  | setPlayersColumnAction
  | setSortPlayersByAction
  | setSearchedPlayerAction
  | setActivePlayerAction
  | setPlayersPageAction
  | setPlayersOwnedPageAction
  | setPlayersTakenPageAction
  | setPlayersAvailablePageAction
  | setActivePlayerLeagueAction
  | setDetailColumnAction
  | setPlayersDetailTabAction
  | setSortOwnedByAction
  | setSortTakenByAction
  | setSortAvailableByAction
  | setFilterTeamAction
  | setFilterDraftClassAction
  | setFilterPositionAction;

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

export const setSortTakenBy = (
  col: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortTakenByAction => ({
  type: "SET_SORT_TAKEN",
  payload: {
    col: col,
    asc: asc,
  },
});

export const setSortAvailableBy = (
  col: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortAvailableByAction => ({
  type: "SET_SORT_AVAILABLE",
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

export const setActivePlayerLeague = (
  league_id: string
): setActivePlayerLeagueAction => ({
  type: "SET_ACTIVE_PLAYER_LEAGUE",
  payload: league_id,
});

export const setPlayersPage = (page: number): setPlayersPageAction => ({
  type: "SET_PLAYERS_PAGE",
  payload: page,
});

export const setPlayersOwnedPage = (
  page: number
): setPlayersOwnedPageAction => ({
  type: "SET_PLAYERS_OWNED_PAGE",
  payload: page,
});

export const setPlayersTakenPage = (
  page: number
): setPlayersTakenPageAction => ({
  type: "SET_PLAYERS_TAKEN_PAGE",
  payload: page,
});

export const setPlayersAvailablePage = (
  page: number
): setPlayersAvailablePageAction => ({
  type: "SET_PLAYERS_AVAILABLE_PAGE",
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

export const setFilterTeam = (team: string): setFilterTeamAction => ({
  type: "SET_FILTER_TEAM",
  payload: team,
});

export const setFilterDraftClass = (
  draftyear: string
): setFilterDraftClassAction => ({
  type: "SET_FILTER_DRAFTCLASS",
  payload: draftyear,
});

export const setFilterPosition = (
  position: string
): setFilterPositionAction => ({
  type: "SET_FILTER_POSITION",
  payload: position,
});
