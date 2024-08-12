import { produce, WritableDraft } from "immer";
import { TradesActionTypes } from "../actions/tradesActions";

export interface TradesState {
  tab: string;
  searchedPlayer: string | false;
  page: number;
  activeTrade: string | false;
  searchedManager: string | false;
}

const initialState: TradesState = {
  tab: "Leaguemate Trades",
  searchedPlayer: false,
  page: 1,
  activeTrade: false,
  searchedManager: false,
};

const tradesReducer = (state = initialState, action: TradesActionTypes) => {
  return produce(state, (draft: WritableDraft<TradesState>) => {
    switch (action.type) {
      case "SET_TRADES_PAGE":
        draft.page = action.payload;
        break;
      case "SET_ACTIVE_TRADE":
        draft.activeTrade = action.payload;
        break;
      case "SET_SEARCHED_MANAGER":
        draft.searchedManager = action.payload;
        break;
      case "SET_SEARCHED_PLAYER":
        draft.searchedPlayer = action.payload;
        break;
      default:
        break;
    }
  });
};

export default tradesReducer;
