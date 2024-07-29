import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import "@/styles/detailnav.css";
import TableMain from "./TableMain";
import HeaderDropdown from "./HeaderDropdown";
import {
  setDetailColumn,
  setPlayersDetailTab,
  setSortOwnedBy,
} from "@/redux/actions/playersActions";
import { User } from "@/lib/types";
import Avatar from "./Avatar";
import { getLeaguesColumn } from "@/helpers/getLeaguesColumn";
import { getSortIcon } from "@/helpers/getSortIcon";

interface PlayerLeaguesProps {
  type: number;
  player_id: string;
  owned: string[];
  taken: {
    lm_roster_id: number;
    lm: User;
    league: string;
  }[];
  available: string[];
}

const PlayerLeagues: React.FC<PlayerLeaguesProps> = ({
  type,
  player_id,
  owned,
  taken,
  available,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current, fpseason } = useSelector(
    (state: RootState) => state.common
  );
  const { leagues } = useSelector((state: RootState) => state.user);

  const {
    detailTab,
    ownedColumn1,
    ownedColumn2,
    ownedColumn3,
    ownedColumn4,
    sortOwnedBy,
    takenColumn3,
    takenColumn4,
    sortTakenBy,
    availableColumn1,
    availableColumn2,
    availableColumn3,
    availableColumn4,
  } = useSelector((state: RootState) => state.players);

  const ownedOptions = [
    { text: "Wins", abbrev: "Wins" },
    { text: "Losses", abbrev: "Losses" },
    { text: "Ties", abbrev: "Ties" },
    { text: "Fantasy Points", abbrev: "FP" },
    { text: "Fantasy Points Against", abbrev: "FPA" },
    { text: "Total Projected Points Rank", abbrev: "T Proj Rk" },
    { text: "Starter Projected Points Rank", abbrev: "S Proj Rk" },
    { text: "KTC Total Rank", abbrev: "T KTC Rk" },
    { text: "KTC Starters Rank", abbrev: "S KTC Rk" },
  ];

  const takenOptions = [...ownedOptions];

  const tableOwned = (
    <TableMain
      type={type}
      headers_sort={[
        {
          text: getSortIcon(0, sortOwnedBy, (colNum, asc) =>
            dispatch(setSortOwnedBy(colNum, asc))
          ),
          colspan: 3,
        },
        {
          text: getSortIcon(1, sortOwnedBy, (colNum, asc) =>
            dispatch(setSortOwnedBy(colNum, asc))
          ),
          colspan: 1,
        },
        {
          text: getSortIcon(2, sortOwnedBy, (colNum, asc) =>
            dispatch(setSortOwnedBy(colNum, asc))
          ),
          colspan: 1,
        },
        {
          text: getSortIcon(3, sortOwnedBy, (colNum, asc) =>
            dispatch(setSortOwnedBy(colNum, asc))
          ),
          colspan: 1,
        },
        {
          text: getSortIcon(4, sortOwnedBy, (colNum, asc) =>
            dispatch(setSortOwnedBy(colNum, asc))
          ),
          colspan: 1,
        },
      ]}
      headers={[
        {
          text: <div>League</div>,
          colspan: 3,
          classname: sortOwnedBy.column === 0 ? "sort" : "",
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={ownedColumn1}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("ownedColumn1", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={ownedColumn2}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("ownedColumn2", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={ownedColumn3}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("ownedColumn3", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={ownedColumn4}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("ownedColumn4", col))
              }
            />
          ),
          colspan: 1,
        },
      ]}
      data={owned.map((league_id, index) => {
        return {
          id: `${league_id}`,
          columns: [
            {
              text: (
                <Avatar
                  id={(leagues && leagues[league_id].avatar) || null}
                  type="L"
                  text={(leagues && leagues[league_id].name) || "-"}
                />
              ),
              colspan: 3,
              classname: sortOwnedBy.column === 0 ? "sort" : "",
            },
            ...[ownedColumn1, ownedColumn2, ownedColumn3, ownedColumn4].map(
              (col, index) => {
                let text, trendColor;

                if (leagues && leagues[league_id]) {
                  ({ text, trendColor } = getLeaguesColumn(
                    col,
                    leagues[league_id],
                    ktc_current || {},
                    fpseason || {},
                    allplayers || {}
                  ));
                } else {
                  text = "-";
                  trendColor = {};
                }
                return {
                  text: text,
                  colspan: 1,
                  style: { ...trendColor },
                  classname: sortOwnedBy.column === index + 1 ? "sort" : "",
                };
              }
            ),
          ],
        };
      })}
    />
  );

  const tableTaken = (
    <TableMain
      type={type}
      headers={[
        {
          text: <div>League</div>,
          colspan: 3,
          classname: sortTakenBy.column === 0 ? "sort" : "",
        },
        {
          text: <div>Owned By</div>,
          colspan: 2,
          classname: sortTakenBy.column === 4 ? "sort" : "",
        },
        {
          text: (
            <HeaderDropdown
              options={takenOptions}
              columnText={takenColumn3}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("takenColumn3", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={takenOptions}
              columnText={takenColumn4}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("takenColumn4", col))
              }
            />
          ),
          colspan: 1,
        },
      ]}
      data={taken.map((lm) => {
        return {
          id: lm.league,
          columns: [
            {
              text: (
                <Avatar
                  id={(leagues && leagues[lm.league].avatar) || null}
                  type="L"
                  text={(leagues && leagues[lm.league].name) || "-"}
                />
              ),
              colspan: 3,
            },
            {
              text: <Avatar id={lm.lm.avatar} type="U" text={lm.lm.username} />,
              colspan: 2,
            },
            ...[takenColumn3, takenColumn4].map((col, index) => {
              let text, trendColor;

              if (leagues && leagues[lm.league]) {
                ({ text, trendColor } = getLeaguesColumn(
                  col,
                  leagues[lm.league],
                  ktc_current || {},
                  fpseason || {},
                  allplayers || {}
                ));
              } else {
                text = "-";
                trendColor = {};
              }

              return {
                text: text,
                colspan: 1,
                style: { ...trendColor },
              };
            }),
          ],
        };
      })}
    />
  );

  const tableAvailable = <TableMain type={type} headers={[]} data={[]} />;
  return (
    <>
      <div className={"nav nav" + type}>
        <div
          className={"button " + (detailTab === "Owned" ? "active" : "")}
          onClick={() => dispatch(setPlayersDetailTab("Owned"))}
        >
          Owned
        </div>
        <div
          className={"button " + (detailTab === "Taken" ? "active" : "")}
          onClick={() => dispatch(setPlayersDetailTab("Taken"))}
        >
          Taken
        </div>
        <div
          className={"button " + (detailTab === "Available" ? "active" : "")}
          onClick={() => dispatch(setPlayersDetailTab("Available"))}
        >
          Available
        </div>
      </div>
      {detailTab === "Owned"
        ? tableOwned
        : detailTab === "Taken"
        ? tableTaken
        : detailTab === "Available"
        ? tableAvailable
        : null}
    </>
  );
};

export default PlayerLeagues;
