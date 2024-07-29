import { produce, WritableDraft } from "immer";
import { UserActionTypes } from "../actions/userActions";
import { League, User } from "@/lib/types";

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
        (draft.leagues = action.payload.leagues),
          (draft.playershares = action.payload.playershares);
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
        break;
      case "SYNC_LEAGUE_ERROR":
        draft.isSyncing = false;
        draft.errorSyncing = action.payload;
        break;
      case "RESET_STATE":
        return initialState;
      default:
        break;
    }
  });
};

export default userReducer;
