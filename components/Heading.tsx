import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import "../styles/heading.css";
import { setType1, setType2 } from "@/redux/actions/commonActions";

const Heading: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2 } = useSelector((state: RootState) => state.common);
  const { user } = useSelector((state: RootState) => state.user);

  const navTab =
    pathname.split("/")[1].charAt(0).toUpperCase() +
    pathname.split("/")[1].slice(1);

  return (
    user && (
      <div className="heading_wrapper">
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
          </select>
        </h2>
      </div>
    )
  );
};

export default Heading;
