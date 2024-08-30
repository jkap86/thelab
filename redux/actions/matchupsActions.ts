interface setMatchupsTabAction {
  type: "SET_MATCHUPS_TAB";
  payload: string;
}

interface setStartersColumnAction {
  type: "SET_STARTERS_COLUMN";
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

interface setMatchupsPageAction {
  type: "SET_MATCHUPS_PAGE";
  payload: number;
}

export type MatchupActionTypes =
  | setActiveMatchupAction
  | setMatchupsPageAction
  | setMatchupsTabAction
  | setStartersColumnAction
  | setSortStartersByAction;

export const setStartersColumn = (
  col: 0 | 1 | 2 | 3 | 4,
  value: string
): setStartersColumnAction => ({
  type: "SET_STARTERS_COLUMN",
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

export const setMatchupsPage = (page: number): setMatchupsPageAction => ({
  type: "SET_MATCHUPS_PAGE",
  payload: page,
});

export const setMatchupsTab = (tab: string): setMatchupsTabAction => ({
  type: "SET_MATCHUPS_TAB",
  payload: tab,
});
