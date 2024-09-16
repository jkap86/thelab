import { produce, WritableDraft } from "immer";
import { UserActionTypes } from "../actions/userActions";
import {
  League,
  Leaguemate,
  Matchup,
  MatchupOptimal,
  Trade,
  User,
} from "@/lib/types";

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
  lmTradeSearches: {
    manager: string | false;
    player: string | false;
    count: number;
    trades: Trade[];
  }[];
  errorLmTrades: string | false;
  isLoadingMatchups: boolean;
  matchups:
    | {
        [key: string]: {
          user: MatchupOptimal;
          opp: MatchupOptimal;
          median?: number;
          league_matchups: Matchup[];
        };
      }
    | false;
  errorMatchups: string | false;
  isSyncingMatchup: string | false;
  errorSyncingMatchup: string | false;
  live_stats: {
    [key: string]: {
      user: {
        points_total: number;
        proj_remaining_total: number;
        players_points: { [player_id: string]: number };
        players_proj_remaining: { [player_id: string]: number };
      };
      opp: {
        points_total: number;
        proj_remaining_total: number;
        players_points: { [player_id: string]: number };
        players_proj_remaining: { [player_id: string]: number };
      };
      median: {
        current: number | undefined;
        projected: number | undefined;
      };
    };
  };
  live_stats_updatedAt: number | false;
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
  lmTradeSearches: [],
  errorLmTrades: false,
  isLoadingMatchups: false,
  matchups: false,
  errorMatchups: false,
  isSyncingMatchup: false,
  errorSyncingMatchup: false,
  live_stats: {},
  live_stats_updatedAt: false,
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
      case "SYNC_MATCHUP_START":
        draft.isSyncingMatchup = action.payload;
        break;
      case "SYNC_MATCHUP_END":
        draft.isSyncingMatchup = false;
        draft.matchups
          ? (draft.matchups[action.payload.league_id] = action.payload.matchups)
          : null;
        break;
      case "SYNC_MATCHUP_ERROR":
        draft.isSyncingMatchup = false;
        draft.errorSyncingMatchup = action.payload;
        break;
      case "FETCH_FILTERED_LMTRADES_END":
        const existing = draft.lmTradeSearches.find(
          (s) =>
            s.manager === action.payload.manager &&
            s.player === action.payload.player
        );

        if (existing) {
          draft.lmTradeSearches = [
            ...draft.lmTradeSearches.filter(
              (s) =>
                !(
                  s.manager === existing.manager && s.player === existing.player
                )
            ),
            {
              ...existing,
              trades: [
                ...existing.trades,
                ...action.payload.trades.filter(
                  (t) =>
                    !existing.trades.some(
                      (t2) => t.transaction_id === t2.transaction_id
                    )
                ),
              ],
            },
          ];
        } else {
          draft.lmTradeSearches.push({
            manager: action.payload.manager,
            player: action.payload.player,
            count: action.payload.count,
            trades: action.payload.trades,
          });
        }

        break;
      case "SET_LIVE_STATS":
        draft.live_stats = action.payload.live;
        draft.live_stats_updatedAt = action.payload.updateAt;
        break;
      case "RESET_STATE":
        return initialState;
      default:
        break;
    }
  });
};

export default userReducer;
