interface setActiveMatchupAction {
  type: "SET_ACTIVE_MATCHUP";
  payload: string | false;
}

interface setMatchupsPageAction {
  type: "SET_MATCHUPS_PAGE";
  payload: number;
}

export type MatchupActionTypes = setActiveMatchupAction | setMatchupsPageAction;

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
