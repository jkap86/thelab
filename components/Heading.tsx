import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import "../styles/heading.css";
import { setType1, setType2 } from "@/redux/actions/commonActions";
import { filterLeagues } from "@/helpers/filterLeagues";

interface HeadingProps {
  navTab: string;
  week: number | false;
}

const Heading: React.FC<HeadingProps> = ({ navTab, week }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2 } = useSelector((state: RootState) => state.common);
  const { user, leagues } = useSelector((state: RootState) => state.user);

  const nav_items = [
    {
      text: "South Harmon Home",
      link: "https://www.southharmonff.com/",
    },
    {
      text: "ADP",
      link: "https://www.southharmonff.com/adp",
    },
    {
      text: "WoRP",
      link: "https://www.southharmonff.com/worp",
    },
    {
      text: "Patreon",
      link: "https://www.patreon.com/SouthHarmon",
    },
    {
      text: "Articles",
      link: "https://www.southharmonff.com/articles",
    },
    {
      text: "Dynasty MindWoRPed",
      link: "https://www.southharmonff.com/mindworped",
    },
    {
      text: "Store",
      link: "https://www.southharmonff.com/store",
    },
    {
      text: "Team Reviews",
      link: "https://www.southharmonff.com/team-reviews",
    },
  ];

  const record = filterLeagues(
    Object.values(leagues || {}),
    type1,
    type2
  ).reduce(
    (acc, cur) => {
      acc.wins += cur.userRoster.wins;
      acc.losses += cur.userRoster.losses;
      acc.ties += cur.userRoster.ties;
      acc.fp += cur.userRoster.fp;
      acc.fpa += cur.userRoster.fpa;
      return acc;
    },
    { wins: 0, losses: 0, ties: 0, fp: 0, fpa: 0 }
  );
  return (
    user && (
      <div className="heading_wrapper">
        <div className="sh_nav">
          {nav_items.map((nav_item) => {
            return (
              <a
                key={nav_item.text}
                rel="noreferrer"
                href={nav_item.link}
                target={
                  !nav_item.link.includes("southharmonff.com")
                    ? "_blank"
                    : "_self"
                }
              >
                {nav_item.text}
              </a>
            );
          })}
        </div>
        <Link href={"/"} className="home">
          The Lab Home
        </Link>
        <div className="heading">
          <h1>
            <Avatar id={user.avatar} type="U" text={user.username} />
          </h1>
          <div className="switch_wrapper">
            <div className="switch">
              <button
                className={"sw " + (type1 === "Redraft" ? "active" : "")}
                onClick={() => dispatch(setType1("Redraft"))}
              >
                Redraft
              </button>
              <button
                className={"sw " + (type1 === "All" ? "active" : "")}
                onClick={() => dispatch(setType1("All"))}
              >
                All
              </button>
              <button
                className={"sw " + (type1 === "Dynasty" ? "active" : "")}
                onClick={() => dispatch(setType1("Dynasty"))}
              >
                Dynasty
              </button>
            </div>
            <div className="switch">
              <button
                className={"sw " + (type2 === "Bestball" ? "active" : "")}
                onClick={() => dispatch(setType2("Bestball"))}
              >
                Bestball
              </button>
              <button
                className={"sw " + (type2 === "All" ? "active" : "")}
                onClick={() => dispatch(setType2("All"))}
              >
                All
              </button>
              <button
                className={"sw " + (type2 === "Lineup" ? "active" : "")}
                onClick={() => dispatch(setType2("Lineup"))}
              >
                Lineup
              </button>
            </div>
          </div>
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
            <table className="record">
              <thead>
                <th>Record</th>
                <th>Win %</th>
                <th>FP</th>
                <th>FPA</th>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {`${record.wins}-${record.losses}${
                      record.ties ? `-${record.ties}` : ""
                    }`}
                  </td>
                  <td>
                    <em>
                      {(
                        record.wins /
                        (record.wins + record.losses + record.ties)
                      ).toFixed(4)}
                    </em>
                  </td>
                  <td>{record.fp.toLocaleString("en-US")}</td>
                  <td>{record.fpa.toLocaleString("en-US")}</td>
                </tr>
              </tbody>
            </table>
          )}
        </h1>
        <h2>{navTab === "Matchups" && `Week ${week}`}</h2>
      </div>
    )
  );
};

export default Heading;
