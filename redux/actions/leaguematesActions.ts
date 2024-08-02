interface setLeaguematesColumnAction {
  type: "SET_LM_COLUMN";
  payload: {
    col: 1 | 2 | 3 | 4;
    value: string;
  };
}

interface setLeaguematesPageAction {
  type: "SET_LM_PAGE";
  payload: number;
}

interface setSortLeaguematesByAction {
  type: "SET_SORT_LM";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

export type LeaguematesActionTypes =
  | setLeaguematesColumnAction
  | setLeaguematesPageAction
  | setSortLeaguematesByAction;

export const setLeaguematesColumn = (
  col: 1 | 2 | 3 | 4,
  value: string
): setLeaguematesColumnAction => ({
  type: "SET_LM_COLUMN",
  payload: {
    col,
    value,
  },
});

export const setLeaguematesPage = (page: number): setLeaguematesPageAction => ({
  type: "SET_LM_PAGE",
  payload: page,
});

export const setSortLeaguematesBy = (
  col: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortLeaguematesByAction => ({
  type: "SET_SORT_LM",
  payload: { col, asc },
});
