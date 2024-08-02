import { produce, WritableDraft } from "immer";
import { TradesActionTypes } from "../actions/tradesActions";

export interface TradesState {
  tab: string;
  searchedPlayer: string | false;
  page: number;
}

const initialState: TradesState = {
  tab: "Leaguemate Trades",
  searchedPlayer: false,
  page: 1,
};

const tradesReducer = (state = initialState, action: TradesActionTypes) => {
  return produce(state, (draft: WritableDraft<TradesState>) => {
    switch (action.type) {
      case "SET_TRADES_PAGE":
        draft.page = action.payload;
        break;
      default:
        break;
    }
  });
};

export default tradesReducer;
