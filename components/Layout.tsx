import {
  fetchAllPlayers,
  fetchFpSeason,
  fetchFpWeek,
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
  const {
    state,
    allplayers,
    isLoadingAllplayers,
    fpseason,
    isLoadingFpSeason,
    ktc_current,
    isLoadingKTC,
    isLoadingFpWeek,
    fpweek,
  } = useSelector((state: RootState) => state.common);
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

  const week = (state && Math.max(state.leg, 1)) || 1;

  useEffect(() => {
    if (!allplayers && !isLoadingAllplayers) {
      dispatch(fetchAllPlayers());
    }
  }, [allplayers, isLoadingAllplayers, dispatch]);

  useEffect(() => {
    if (!ktc_current && !isLoadingKTC) {
      dispatch(fetchKTC_dates());
    }
  }, [ktc_current, isLoadingKTC, dispatch]);

  useEffect(() => {
    if (!fpseason && !isLoadingFpSeason) {
      dispatch(fetchFpSeason());
    }
  }, [fpseason, isLoadingFpSeason, dispatch]);

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
      dispatch(fetchLeagues(user.user_id, week, fpseason, allplayers));
    }
  }, [
    username,
    allplayers,
    fpseason,
    user,
    week,
    leagues,
    isLoadingUser,
    errorUser,
    isLoadingLeagues,
    dispatch,
  ]);

  // MATCHUPS

  useEffect(() => {
    if (
      navTab.toLowerCase() === "matchups" &&
      allplayers &&
      leagues &&
      fpweek &&
      !matchups
    ) {
      dispatch(fetchMatchups(leagues, week, allplayers, fpweek));
    }
  }, [navTab, leagues, matchups, allplayers, fpweek, week, dispatch]);

  useEffect(() => {
    if (navTab.toLowerCase() === "matchups" && !fpweek && !isLoadingFpWeek) {
      dispatch(fetchFpWeek(week));
    }
  }, [week, navTab, fpweek, isLoadingFpWeek, dispatch]);

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
      <Heading navTab={navTab} week={week} />
      <h1>Loading...</h1>
    </>
  ) : (
    <>
      <Heading navTab={navTab} week={week} />
      {content}
    </>
  );
};

export default Layout;
