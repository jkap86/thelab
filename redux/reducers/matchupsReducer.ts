import { produce, WritableDraft } from "immer";
import { MatchupActionTypes } from "../actions/matchupsActions";

export interface MatchupsState {
  page: number;
  activeMatchup: string | false;
}

const initialState: MatchupsState = {
  page: 1,
  activeMatchup: false,
};

const matchupsReducer = (state = initialState, action: MatchupActionTypes) => {
  return produce(state, (draft: WritableDraft<MatchupsState>) => {
    switch (action.type) {
      case "SET_MATCHUPS_PAGE":
        draft.page = action.payload;
        break;
      case "SET_ACTIVE_MATCHUP":
        draft.activeMatchup = action.payload;
        break;
      default:
        break;
    }
  });
};

export default matchupsReducer;
