import { produce, WritableDraft } from "immer";
import { TradesActionTypes } from "../actions/tradesActions";

export interface TradesState {
  tab: string;
  searchedPlayer: string | false;
  page: number;
  activeTrade: string | false;
  searchedManager: string | false;
  detailTab: string;
  rostersTab1: string;
  rostersTab2: string;
  activeTip: string | false;
  valueType: string;
}

const initialState: TradesState = {
  tab: "LM",
  searchedPlayer: false,
  page: 1,
  activeTrade: false,
  searchedManager: false,
  detailTab: "League",
  rostersTab1: "Standings",
  rostersTab2: "Settings",
  activeTip: false,
  valueType: "KTC",
};

const tradesReducer = (state = initialState, action: TradesActionTypes) => {
  return produce(state, (draft: WritableDraft<TradesState>) => {
    switch (action.type) {
      case "SET_TAB":
        draft.tab = action.payload;
        break;
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
      case "SET_ROSTERS_TAB":
        switch (action.payload.num) {
          case 1:
            draft.rostersTab1 = action.payload.value;
            break;
          case 2:
            draft.rostersTab2 = action.payload.value;
            break;
          default:
            break;
        }
        break;
      case "SET_DETAIL_TAB":
        draft.detailTab = action.payload;
        break;
      case "SET_ACTIVE_TIP":
        draft.activeTip = action.payload;
        break;
      case "SET_VALUE_TYPE":
        draft.valueType = action.payload;
        break;
      default:
        break;
    }
  });
};

export default tradesReducer;
