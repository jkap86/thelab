interface setTradesPageAction {
  type: "SET_TRADES_PAGE";
  payload: number;
}

interface setActiveTradeAction {
  type: "SET_ACTIVE_TRADE";
  payload: string | false;
}

export type TradesActionTypes = setTradesPageAction | setActiveTradeAction;

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
