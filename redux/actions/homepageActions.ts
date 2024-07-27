import { SET_USERNAME_SEARCHED, SetUsernameSearchedAction } from "@/lib/types";

export const SetUsernameSearched = (
  username_searched: string
): SetUsernameSearchedAction => ({
  type: SET_USERNAME_SEARCHED,
  payload: username_searched,
});
