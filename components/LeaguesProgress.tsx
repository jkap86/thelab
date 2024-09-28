import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const LeaguesProgress: React.FC = () => {
  const { leaguesProgress } = useSelector((state: RootState) => state.user);

  return <>{leaguesProgress} Leagues Loaded</>;
};

export default LeaguesProgress;
