import {
  fetchAllPlayers,
  fetchFpSeason,
  fetchKTC_dates,
} from "@/redux/actions/commonActions";
import {
  fetchLeagues,
  fetchMatchups,
  fetchUser,
  resetState,
} from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Heading from "./Heading";

interface LayoutProps {
  username: string;
  content: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ username, content }) => {
  const dispatch: AppDispatch = useDispatch();
  const pathname = usePathname();
  const { allplayers, isLoadingAllplayers, ktc_current, fpseason } =
    useSelector((state: RootState) => state.common);
  const {
    user,
    isLoadingUser,
    errorUser,
    leagues,
    isLoadingLeagues,
    errorLeagues,
    matchups,
  } = useSelector((state: RootState) => state.user);

  const navTab =
    pathname.split("/")[1].charAt(0).toUpperCase() +
    pathname.split("/")[1].slice(1);

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
    } else if (
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
    username,
    allplayers,
    fpseason,
    user,
    leagues,
    isLoadingUser,
    errorUser,
    isLoadingLeagues,
    dispatch,
    fetchUser,
    fetchLeagues,
  ]);

  // MATCHUPS

  useEffect(() => {
    if (navTab.toLowerCase() === "matchups" && leagues && !matchups) {
      dispatch(fetchMatchups(Object.keys(leagues)));
    }
  }, [navTab, leagues, matchups, dispatch]);

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
      <Heading navTab={navTab} />
      <h1>Loading...</h1>
    </>
  ) : (
    <>
      <Heading navTab={navTab} />
      {content}
    </>
  );
};

export default Layout;
