import {
  fetchAllPlayers,
  fetchFpSeason,
  fetchKTC_dates,
} from "@/redux/actions/commonActions";
import {
  fetchLeagues,
  fetchUser,
  resetState,
} from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Heading from "./Heading";

interface LayoutProps {
  username: string;
  content: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ username, content }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, isLoadingAllplayers, ktc_current, fpseason } =
    useSelector((state: RootState) => state.common);
  const {
    user,
    isLoadingUser,
    errorUser,
    leagues,
    isLoadingLeagues,
    errorLeagues,
  } = useSelector((state: RootState) => state.user);

  console.log({ leagues });

  useEffect(() => {
    if (!allplayers && !isLoadingAllplayers) {
      dispatch(fetchAllPlayers());
    }
  }, [allplayers, isLoadingAllplayers, dispatch, fetchAllPlayers]);

  useEffect(() => {
    dispatch(fetchKTC_dates());
    dispatch(fetchFpSeason());
  }, []);

  useEffect(() => {
    if (user && username.toLowerCase() !== user.username.toLowerCase()) {
      dispatch(resetState());
    } else if (!user && !isLoadingUser && !errorUser) {
      dispatch(fetchUser(username));
    }
  }, [username, user, isLoadingUser, errorUser, dispatch, fetchUser]);

  useEffect(() => {
    if (
      user &&
      !errorUser &&
      !leagues &&
      !isLoadingLeagues &&
      allplayers &&
      fpseason
    ) {
      dispatch(fetchLeagues(user.user_id, fpseason, allplayers));
    }
  }, [
    user,
    leagues,
    isLoadingLeagues,
    dispatch,
    fetchLeagues,
    allplayers,
    fpseason,
  ]);

  return (errorUser && errorUser) || (errorLeagues && errorLeagues) ? (
    <h1>
      {errorUser}
      <br />
      {errorLeagues}
    </h1>
  ) : isLoadingUser ? (
    <h1>Loading...</h1>
  ) : user && isLoadingLeagues ? (
    <>
      <Heading />
      <h1>Loading...</h1>
    </>
  ) : (
    <>
      <Heading />
      {content}
    </>
  );
};

export default Layout;
