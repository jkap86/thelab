import { combineReducers } from "redux";
import homepageReducer from "./reducers/homepageReducer";
import commonReducer from "./reducers/commonReducer";
import userReducer from "./reducers/userReducer";
import leaguesReducer from "./reducers/leaguesReducer";
import playersReducer from "./reducers/playersReducer";
import LeaguematesReducer from "./reducers/leaguematesReducer";
import tradesReducer from "./reducers/tradesReducer";

const rootReducer = combineReducers({
  home: homepageReducer,
  common: commonReducer,
  user: userReducer,
  leagues: leaguesReducer,
  players: playersReducer,
  leaguemates: LeaguematesReducer,
  trades: tradesReducer,
});

export default rootReducer;
