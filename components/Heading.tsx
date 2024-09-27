import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "../styles/heading.css";
import SouthHarmonNavbar from "./SouthHarmonNavbar";
import LeagueTypeSwitcher from "./LeagueTypeSwitcher";
import RecordTable from "./RecordTable";

interface HeadingProps {
  navTab: string;
  week: number | false;
}

const Heading: React.FC<HeadingProps> = ({ navTab, week }) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="heading_wrapper">
      <SouthHarmonNavbar />
      {navTab !== "homepage" && user && (
        <>
          <Link href={"/"} className="home">
            The Lab Home
          </Link>
          <div className="heading">
            <h1>
              <Avatar id={user.avatar} type="U" text={user.username} />
            </h1>
            <LeagueTypeSwitcher />
          </div>
          <h2>
            <select
              value={navTab}
              onChange={(e) =>
                router.push(`/${e.target.value.toLowerCase()}/${user.username}`)
              }
            >
              <option>Leagues</option>
              <option>Players</option>
              <option disabled>Leaguemates</option>
              <option>Trades</option>
              <option>Matchups</option>
            </select>
          </h2>
          <h1>
            {["Leagues", "Players", "Leaguemates"].includes(navTab) && (
              <RecordTable />
            )}
          </h1>
          <h2>{navTab === "Matchups" && `Week ${week}`}</h2>
        </>
      )}
    </div>
  );
};

export default Heading;
