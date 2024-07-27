import {
  HomepageState,
  UsernameSearchedAction,
  SET_USERNAME_SEARCHED,
} from "@/lib/types";

const initialState: HomepageState = {
  username_searched: "",
};

const homepageReducer = (
  state = initialState,
  action: UsernameSearchedAction
): HomepageState => {
  switch (action.type) {
    case SET_USERNAME_SEARCHED:
      return { ...state, username_searched: action.payload };
    default:
      return state;
  }
};

export default homepageReducer;
