import {
  setLineupcheckColumn,
  setSecondaryTabStarters,
} from "@/redux/actions/matchupsActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import TableMain from "./TableMain";
import HeaderDropdown from "./HeaderDropdown";
import {
  columnOptions_lc,
  getLineupcheckColumn,
} from "@/helpers/getLineupcheckColumn";
import { filterLeagueIds } from "@/helpers/filterLeagues";
import Avatar from "./Avatar";

interface PlayerMatchupsProps {
  player_id: string;
  starters_obj: {
    user: { [key: string]: { start: string[]; bench: string[] } };
    opp: { [key: string]: { start: string[]; bench: string[] } };
  };
}

const PlayerMatchups: React.FC<PlayerMatchupsProps> = ({
  player_id,
  starters_obj,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2, allplayers } = useSelector(
    (state: RootState) => state.common
  );
  const { matchups, leagues } = useSelector((state: RootState) => state.user);
  const {
    column1,
    column2,
    column3,
    column4,
    secondaryTabStarters,
    sortLineupcheckBy,
  } = useSelector((state: RootState) => state.matchups);

  const getTable = (league_ids: string[]) => {
    return (
      <TableMain
        type={2}
        headers={[
          { text: "League", colspan: 3 },
          {
            text: (
              <HeaderDropdown
                options={columnOptions_lc}
                columnText={column1}
                setColumnText={(col) => dispatch(setLineupcheckColumn(1, col))}
              />
            ),
            colspan: 1,
          },
          {
            text: (
              <HeaderDropdown
                options={columnOptions_lc}
                columnText={column2}
                setColumnText={(col) => dispatch(setLineupcheckColumn(2, col))}
              />
            ),
            colspan: 1,
          },
          {
            text: (
              <HeaderDropdown
                options={columnOptions_lc}
                columnText={column3}
                setColumnText={(col) => dispatch(setLineupcheckColumn(3, col))}
              />
            ),
            colspan: 1,
          },
          {
            text: (
              <HeaderDropdown
                options={columnOptions_lc}
                columnText={column4}
                setColumnText={(col) => dispatch(setLineupcheckColumn(4, col))}
              />
            ),
            colspan: 1,
          },
        ]}
        data={
          (leagues &&
            filterLeagueIds(league_ids, leagues, type1, type2)
              .sort((a, b) => leagues[a].index - leagues[b].index)
              .map((league_id) => {
                return {
                  id: league_id,
                  columns: [
                    {
                      text: (
                        <Avatar
                          id={leagues[league_id].avatar}
                          type={"L"}
                          text={leagues[league_id].name}
                        />
                      ),
                      colspan: 3,
                    },
                    ...[column1, column2, column3, column4].map((col) => {
                      const { text, trendColor } = (matchups &&
                        getLineupcheckColumn(
                          col,
                          sortLineupcheckBy.asc,
                          matchups[league_id],
                          leagues[league_id]
                        )) || { text: "", trendColor: {} };

                      return {
                        text: text,
                        style: { ...trendColor },
                        colspan: 1,
                      };
                    }),
                  ],
                };
              })) ||
          []
        }
      />
    );
  };

  return (
    <>
      <div className={"nav nav2"}>
        <div
          className={
            "button " + (secondaryTabStarters === "Start" ? "active" : "")
          }
          onClick={() => dispatch(setSecondaryTabStarters("Start"))}
        >
          Start
        </div>
        <div
          className={
            "button " + (secondaryTabStarters === "Bench" ? "active" : "")
          }
          onClick={() => dispatch(setSecondaryTabStarters("Bench"))}
        >
          Bench
        </div>
        <div
          className={
            "button " + (secondaryTabStarters === "Opp Start" ? "active" : "")
          }
          onClick={() => dispatch(setSecondaryTabStarters("Opp Start"))}
        >
          Opp Start
        </div>
        <div
          className={
            "button " + (secondaryTabStarters === "Opp Bench" ? "active" : "")
          }
          onClick={() => dispatch(setSecondaryTabStarters("Opp Bench"))}
        >
          Opp Bench
        </div>
      </div>
      {secondaryTabStarters === "Start"
        ? getTable(starters_obj.user[player_id].start)
        : secondaryTabStarters === "Bench"
        ? getTable(starters_obj.user[player_id].bench)
        : secondaryTabStarters === "Opp Start"
        ? getTable(starters_obj.opp[player_id].start)
        : secondaryTabStarters === "Opp Bench"
        ? getTable(starters_obj.opp[player_id].bench)
        : null}
    </>
  );
};

export default PlayerMatchups;
