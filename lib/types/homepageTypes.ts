export const SET_USERNAME_SEARCHED = "SET_USERNAME_SEARCHED";

export interface HomepageState {
  username_searched: string;
}

export interface SetUsernameSearchedAction {
  type: typeof SET_USERNAME_SEARCHED;
  payload: string;
}

export type UsernameSearchedAction = SetUsernameSearchedAction;
