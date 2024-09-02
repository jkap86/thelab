interface setMatchupsTabAction {
  type: "SET_MATCHUPS_TAB";
  payload: string;
}

interface setLcColumnAction {
  type: "SET_LC_COLUMN";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    value: string;
  };
}

interface setSortStartersByAction {
  type: "SET_SORT_STARTERS";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

interface setActiveMatchupAction {
  type: "SET_ACTIVE_MATCHUP";
  payload: string | false;
}

interface setActiveStarterAction {
  type: "SET_ACTIVE_STARTER";
  payload: string | false;
}

interface setMatchupsPageAction {
  type: "SET_MATCHUPS_PAGE";
  payload: number;
}

interface setStartersPageAction {
  type: "SET_STARTERS_PAGE";
  payload: number;
}

interface setSearchedStarterAction {
  type: "SET_SEARCHED_STARTER";
  payload: string | false;
}

interface setSecondaryTabStartersAction {
  type: "SET_SECONDARYTAB_STARTERS";
  payload: string;
}

export type MatchupActionTypes =
  | setActiveMatchupAction
  | setMatchupsPageAction
  | setMatchupsTabAction
  | setLcColumnAction
  | setSortStartersByAction
  | setSearchedStarterAction
  | setStartersPageAction
  | setSecondaryTabStartersAction
  | setActiveStarterAction;

export const setLineupcheckColumn = (
  col: 0 | 1 | 2 | 3 | 4,
  value: string
): setLcColumnAction => ({
  type: "SET_LC_COLUMN",
  payload: { col, value },
});

export const setSortStartersBy = (
  column: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortStartersByAction => ({
  type: "SET_SORT_STARTERS",
  payload: {
    col: column,
    asc: asc,
  },
});

export const setActiveMatchup = (
  league_id: string | false
): setActiveMatchupAction => ({
  type: "SET_ACTIVE_MATCHUP",
  payload: league_id,
});

export const setActiveStarter = (
  player_id: string | false
): setActiveStarterAction => ({
  type: "SET_ACTIVE_STARTER",
  payload: player_id,
});

export const setMatchupsPage = (page: number): setMatchupsPageAction => ({
  type: "SET_MATCHUPS_PAGE",
  payload: page,
});

export const setStartersPage = (page: number): setStartersPageAction => ({
  type: "SET_STARTERS_PAGE",
  payload: page,
});

export const setMatchupsTab = (tab: string): setMatchupsTabAction => ({
  type: "SET_MATCHUPS_TAB",
  payload: tab,
});

export const setSearchedStarter = (
  searched: string | false
): setSearchedStarterAction => ({
  type: "SET_SEARCHED_STARTER",
  payload: searched,
});

export const setSecondaryTabStarters = (
  tab: string
): setSecondaryTabStartersAction => ({
  type: "SET_SECONDARYTAB_STARTERS",
  payload: tab,
});
