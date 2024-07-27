import { combineReducers } from "redux";
import homepageReducer from "./reducers/homepageReducer";
import commonReducer from "./reducers/commonReducer";
import userReducer from "./reducers/userReducer";
import leaguesReducer from "./reducers/leaguesReducer";
import playersReducer from "./reducers/playersReducer";

const rootReducer = combineReducers({
  home: homepageReducer,
  common: commonReducer,
  user: userReducer,
  leagues: leaguesReducer,
  players: playersReducer,
});

export default rootReducer;
