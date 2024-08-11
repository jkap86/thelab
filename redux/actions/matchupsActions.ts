interface setActiveMatchupAction {
  type: "SET_ACTIVE_MATCHUP";
  payload: string | false;
}
export type MatchupActionTypes = setActiveMatchupAction;

export const setActiveMatchup = (
  league_id: string | false
): setActiveMatchupAction => ({
  type: "SET_ACTIVE_MATCHUP",
  payload: league_id,
});
