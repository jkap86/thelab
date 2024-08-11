import { produce, WritableDraft } from "immer";
import { UserActionTypes } from "../actions/userActions";
import { League, Leaguemate, MatchupOptimal, Trade, User } from "@/lib/types";

export interface UserState {
  user: User | false;
  isLoadingUser: boolean;
  errorUser: string | false;
  leagues: { [key: string]: League } | false;
  isLoadingLeagues: boolean;
  errorLeagues: string | false;
  isSyncing: string | false;
  errorSyncing: string | false;
  playershares: {
    [key: string]: {
      owned: string[];
      taken: {
        lm_roster_id: number;
        lm: User;
        league: string;
      }[];
      available: string[];
    };
  };
  leaguemates: {
    [key: string]: Leaguemate;
  };
  isLoadingLmTrades: boolean;
  lmTrades: {
    count: number;
    trades: Trade[] | false;
  };
  errorLmTrades: string | false;
  isLoadingMatchups: boolean;
  matchups: { [key: string]: MatchupOptimal[] } | false;
  errorMatchups: string | false;
}
const initialState: UserState = {
  user: false,
  isLoadingUser: false,
  errorUser: false,
  leagues: false,
  isLoadingLeagues: false,
  errorLeagues: false,
  isSyncing: false,
  errorSyncing: false,
  playershares: {},
  leaguemates: {},
  isLoadingLmTrades: false,
  lmTrades: {
    count: 0,
    trades: false,
  },
  errorLmTrades: false,
  isLoadingMatchups: false,
  matchups: false,
  errorMatchups: false,
};

const userReducer = (state = initialState, action: UserActionTypes) => {
  return produce(state, (draft: WritableDraft<UserState>) => {
    switch (action.type) {
      case "FETCH_USER_START":
        draft.isLoadingUser = true;
        break;
      case "SET_STATE_USER":
        draft.isLoadingUser = false;
        draft.user = action.payload;
        break;
      case "FETCH_USER_ERROR":
        draft.isLoadingUser = false;
        draft.errorUser = action.payload;
        break;
      case "FETCH_LEAGUES_START":
        draft.isLoadingLeagues = true;
        break;
      case "SET_STATE_LEAGUES":
        draft.isLoadingLeagues = false;
        draft.leagues = action.payload.leagues;
        draft.playershares = action.payload.playershares;
        draft.leaguemates = action.payload.leaguemates;
        break;
      case "FETCH_LEAGUES_ERROR":
        draft.isLoadingLeagues = false;
        draft.errorLeagues = action.payload;
        break;
      case "SYNC_LEAGUE_START":
        draft.isSyncing = action.payload;
        break;
      case "SYNC_LEAGUE_END":
        draft.isSyncing = false;
        draft.leagues = action.payload.leagues;
        draft.playershares = action.payload.playershares;
        draft.leaguemates = action.payload.leaguemates;
        break;
      case "SYNC_LEAGUE_ERROR":
        draft.isSyncing = false;
        draft.errorSyncing = action.payload;
        break;
      case "SET_STATE_LMTRADES":
        draft.lmTrades = {
          count: action.payload.count,
          trades: draft.lmTrades.trades
            ? [
                ...draft.lmTrades.trades,
                ...action.payload.trades.filter(
                  (t) =>
                    !(draft.lmTrades.trades || []).some(
                      (x) => t.transaction_id === x.transaction_id
                    )
                ),
              ]
            : action.payload.trades,
        };
        break;
      case "FETCH_MATCHUPS_START":
        draft.isLoadingMatchups = true;
        break;
      case "FETCH_MATCHUPS_END":
        draft.isLoadingMatchups = false;
        draft.matchups = action.payload;
        break;
      case "FETCH_MATCHUPS_ERROR":
        draft.isLoadingMatchups = false;
        draft.errorMatchups = action.payload;
        break;
      case "RESET_STATE":
        return initialState;
      default:
        break;
    }
  });
};

export default userReducer;
