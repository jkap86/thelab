import { setType1, setType2 } from "@/redux/actions/commonActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const LeagueTypeSwitcher: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2 } = useSelector((state: RootState) => state.common);

  return (
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
  );
};

export default LeagueTypeSwitcher;
