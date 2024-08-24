interface setTradesPageAction {
  type: "SET_TRADES_PAGE";
  payload: number;
}

interface setActiveTradeAction {
  type: "SET_ACTIVE_TRADE";
  payload: string | false;
}

interface setSearchedManagerAction {
  type: "SET_SEARCHED_MANAGER";
  payload: string | false;
}

interface setSearchedPlayerAction {
  type: "SET_SEARCHED_PLAYER";
  payload: string | false;
}

interface setDetailTabAction {
  type: "SET_DETAIL_TAB";
  payload: string;
}

interface setRostersTabAction {
  type: "SET_ROSTERS_TAB";
  payload: {
    num: 1 | 2;
    value: string;
  };
}

interface setActiveTipAction {
  type: "SET_ACTIVE_TIP";
  payload: string | false;
}

export type TradesActionTypes =
  | setTradesPageAction
  | setActiveTradeAction
  | setSearchedManagerAction
  | setSearchedPlayerAction
  | setRostersTabAction
  | setDetailTabAction
  | setActiveTipAction;

export const setTradesPage = (page: number): setTradesPageAction => ({
  type: "SET_TRADES_PAGE",
  payload: page,
});

export const setActiveTrade = (
  transaction_id: string | false
): setActiveTradeAction => ({
  type: "SET_ACTIVE_TRADE",
  payload: transaction_id,
});

export const setSearchedManager = (
  user_id: string | false
): setSearchedManagerAction => ({
  type: "SET_SEARCHED_MANAGER",
  payload: user_id,
});

export const setSearchedPlayer = (
  player_id: string | false
): setSearchedPlayerAction => ({
  type: "SET_SEARCHED_PLAYER",
  payload: player_id,
});

export const setDetailTab = (tab: string): setDetailTabAction => ({
  type: "SET_DETAIL_TAB",
  payload: tab,
});

export const setRostersTab = (
  num: 1 | 2,
  value: string
): setRostersTabAction => ({
  type: "SET_ROSTERS_TAB",
  payload: { num, value },
});

export const setActiveTip = (id: string | false): setActiveTipAction => ({
  type: "SET_ACTIVE_TIP",
  payload: id,
});
