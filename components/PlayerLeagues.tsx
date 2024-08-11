import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import "@/styles/detailnav.css";
import TableMain from "./TableMain";
import HeaderDropdown from "./HeaderDropdown";
import {
  setActivePlayerLeague,
  setDetailColumn,
  setPlayersDetailTab,
  setSortOwnedBy,
  setSortTakenBy,
} from "@/redux/actions/playersActions";
import { User } from "@/lib/types";
import Avatar from "./Avatar";
import {
  getLeaguesColumn,
  getLeaguesSortValue,
} from "@/helpers/getLeaguesColumn";
import { getSortIcon } from "@/helpers/getSortIcon";
import Standings from "./Standings";
import {
  setStandingsColumn,
  setStandingsTab,
  setStandingsTab2,
  setTeamColumn,
} from "@/redux/actions/leaguesActions";

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
  const { standingsColumn, standingsTab, standingsTab2, teamColumn } =
    useSelector((state: RootState) => state.leagues);
  const {
    activePlayerLeague,
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
    sortAvailableBy,
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

  const takenOptions = [
    ...ownedOptions,
    { text: "Lm Wins", abbrev: "Lm Wins" },
    {
      text: "Leaguemate Total Projected Points Rank",
      abbrev: "LmT Proj",
    },
    {
      text: "Leaguemate Starter Projected Points Rank",
      abbrev: "LmS Proj",
    },
  ];

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
      data={owned
        .map((league_id, index) => {
          let sortCol;

          if (sortOwnedBy.column === 0 && sortOwnedBy.asc) {
            sortCol = "League";
          } else {
            sortCol =
              [ownedColumn1, ownedColumn2, ownedColumn3, ownedColumn4].find(
                (col, index) => sortOwnedBy.column === index + 1
              ) || "Index";
          }
          return {
            id: `${league_id}`,
            sortby:
              leagues &&
              getLeaguesSortValue(
                sortCol,
                sortOwnedBy.asc,
                leagues[league_id],
                ktc_current || {},
                fpseason || {},
                allplayers || {}
              ),
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
            secondaryTable: leagues && (
              <Standings
                type={3}
                league={leagues[league_id]}
                standingsColumn={standingsColumn}
                setStandingsColumn={(col) => dispatch(setStandingsColumn(col))}
                standingsTab={standingsTab}
                standingsTab2={standingsTab2}
                setStandingsTab={(tab) => dispatch(setStandingsTab(tab))}
                setStandingsTab2={(tab) => dispatch(setStandingsTab2(tab))}
                teamColumn={teamColumn}
                setTeamColumn={(col) => dispatch(setTeamColumn(col))}
              />
            ),
          };
        })
        .sort((a, b) =>
          sortOwnedBy.asc
            ? a.sortby > b.sortby
              ? 1
              : -1
            : a.sortby < b.sortby
            ? 1
            : -1
        )}
      active={activePlayerLeague}
      setActive={(league_id) => dispatch(setActivePlayerLeague(league_id))}
    />
  );

  const tableTaken = (
    <TableMain
      type={type}
      headers_sort={[
        {
          text: getSortIcon(0, sortTakenBy, (colNum, asc) =>
            dispatch(setSortTakenBy(colNum, asc))
          ),
          colspan: 3,
        },
        {
          text: getSortIcon(1, sortTakenBy, (colNum, asc) =>
            dispatch(setSortTakenBy(colNum, asc))
          ),
          colspan: 2,
        },
        {
          text: getSortIcon(2, sortTakenBy, (colNum, asc) =>
            dispatch(setSortTakenBy(colNum, asc))
          ),
          colspan: 1,
        },
        {
          text: getSortIcon(3, sortTakenBy, (colNum, asc) =>
            dispatch(setSortTakenBy(colNum, asc))
          ),
          colspan: 1,
        },
      ]}
      headers={[
        {
          text: <div>League</div>,
          colspan: 3,
          classname: sortTakenBy.column === 0 ? "sort" : "",
        },
        {
          text: <div>Owned By</div>,
          colspan: 2,
          classname: sortTakenBy.column === 1 ? "sort" : "",
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
          classname: sortTakenBy.column === 2 ? "sort" : "",
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
          classname: sortTakenBy.column === 3 ? "sort" : "",
        },
      ]}
      data={taken
        .map((lm) => {
          let sortCol;

          if (sortTakenBy.column === 0 && sortTakenBy.asc) {
            sortCol = "League";
          } else if (sortTakenBy.column === 0 && !sortTakenBy.asc) {
            sortCol = "Index";
          } else if (sortTakenBy.column === 1) {
            sortCol = "Owned By";
          } else {
            sortCol =
              [takenColumn3, takenColumn4].find(
                (col, index) => sortTakenBy.column === index + 2
              ) || "Index";
          }
          return {
            id: lm.league,
            sortby:
              leagues &&
              getLeaguesSortValue(
                sortCol,
                sortOwnedBy.asc,
                leagues[lm.league],
                ktc_current || {},
                fpseason || {},
                allplayers || {},
                lm.lm.username
              ),
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
                classname: sortTakenBy.column === 0 ? "sort" : "",
              },
              {
                text: (
                  <Avatar id={lm.lm.avatar} type="U" text={lm.lm.username} />
                ),
                colspan: 2,
                classname: sortTakenBy.column === 1 ? "sort" : "",
              },
              ...[takenColumn3, takenColumn4].map((col, index) => {
                let text, trendColor;

                if (leagues && leagues[lm.league]) {
                  ({ text, trendColor } = getLeaguesColumn(
                    col,
                    leagues[lm.league],
                    ktc_current || {},
                    fpseason || {},
                    allplayers || {},
                    leagues[lm.league].rosters.find(
                      (r) => r.roster_id === lm.lm_roster_id
                    )
                  ));
                } else {
                  text = "-";
                  trendColor = {};
                }

                return {
                  text: text,
                  colspan: 1,
                  style: { ...trendColor },
                  classname: sortTakenBy.column === index + 2 ? "sort" : "",
                };
              }),
            ],
          };
        })
        .sort((a, b) =>
          sortTakenBy.asc
            ? a.sortby > b.sortby
              ? 1
              : -1
            : a.sortby < b.sortby
            ? 1
            : -1
        )}
    />
  );

  const tableAvailable = (
    <TableMain
      type={type}
      headers={[
        {
          text: <div>League</div>,
          colspan: 3,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={availableColumn1}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("availableColumn1", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={availableColumn2}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("availableColumn2", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={availableColumn3}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("availableColumn3", col))
              }
            />
          ),
          colspan: 1,
        },
        {
          text: (
            <HeaderDropdown
              options={ownedOptions}
              columnText={availableColumn4}
              setColumnText={(col: string) =>
                dispatch(setDetailColumn("availableColumn4", col))
              }
            />
          ),
          colspan: 1,
        },
      ]}
      data={
        (leagues &&
          available.map((league_id) => {
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
                ...[
                  availableColumn1,
                  availableColumn2,
                  availableColumn3,
                  availableColumn4,
                ].map((col, index) => {
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
                  };
                }),
              ],
            };
          })) ||
        []
      }
    />
  );

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
