"use client";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import TableMain from "@/components/TableMain";
import { AppDispatch, RootState } from "@/redux/store";
import Avatar from "@/components/Avatar";
import HeaderDropdown from "@/components/HeaderDropdown";
import {
  setActiveLeague,
  setLeaguesColumn,
  setLeaguesPage,
  setSearchedLeague,
  setSortLeaguesBy,
  setStandingsColumn,
  setStandingsTab,
  setStandingsTab2,
  setTeamColumn,
} from "@/redux/actions/leaguesActions";
import {
  getLeaguesColumn,
  getLeaguesSortValue,
} from "@/helpers/getLeaguesColumn";
import Standings from "@/components/Standings";
import { getSortIcon } from "@/helpers/getSortIcon";
import { filterLeagues } from "@/helpers/filterLeagues";

interface LeaguesProps {
  params: { username: string };
}

const Leagues: React.FC<LeaguesProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { ktc_current, type1, type2, fpseason, allplayers } = useSelector(
    (state: RootState) => state.common
  );
  const { leagues } = useSelector((state: RootState) => state.user);
  const {
    column1,
    column2,
    column3,
    column4,
    activeLeague,
    sortLeaguesBy,
    standingsColumn,
    standingsTab,
    standingsTab2,
    teamColumn,
    searchedLeague,
    page,
  } = useSelector((state: RootState) => state.leagues);

  const columnOptions = [
    { text: "League ID", abbrev: "L ID" },
    { text: "Wins", abbrev: "Wins" },
    { text: "Losses", abbrev: "Losses" },
    { text: "Ties", abbrev: "Ties" },
    { text: "Fantasy Points", abbrev: "FP" },
    { text: "Fantasy Points Against", abbrev: "FPA" },
    { text: "Open Roster Spots", abbrev: "O R S" },
    { text: "Open Taxi Spots", abbrev: "O T S" },
    { text: "Open IR Spots", abbrev: "O IR S" },
    { text: "Total Projected Points Rank", abbrev: "T Proj Rk" },
    { text: "Starter Projected Points Rank", abbrev: "S Proj Rk" },
    { text: "Total KTC Rank", abbrev: "T KTC Rk" },
    { text: "Starters KTC Rank", abbrev: "S KTC Rk" },
  ];

  const headers_sort = [
    {
      text: getSortIcon(0, sortLeaguesBy, (colNum, asc) =>
        dispatch(setSortLeaguesBy(colNum, asc))
      ),
      colspan: 3,
    },
    {
      text: getSortIcon(1, sortLeaguesBy, (colNum, asc) =>
        dispatch(setSortLeaguesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(2, sortLeaguesBy, (colNum, asc) =>
        dispatch(setSortLeaguesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(3, sortLeaguesBy, (colNum, asc) =>
        dispatch(setSortLeaguesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(4, sortLeaguesBy, (colNum, asc) =>
        dispatch(setSortLeaguesBy(colNum, asc))
      ),
      colspan: 1,
    },
  ];

  const headers = [
    {
      text: <div>League</div>,
      colspan: 3,
      classname: sortLeaguesBy.column === 0 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column1}
          setColumnText={(value) => dispatch(setLeaguesColumn(1, value))}
        />
      ),
      colspan: 1,
      classname: sortLeaguesBy.column === 1 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column2}
          setColumnText={(value) => dispatch(setLeaguesColumn(2, value))}
        />
      ),
      colspan: 1,
      classname: sortLeaguesBy.column === 2 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column3}
          setColumnText={(value) => dispatch(setLeaguesColumn(3, value))}
        />
      ),
      colspan: 1,
      classname: sortLeaguesBy.column === 3 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column4}
          setColumnText={(value) => dispatch(setLeaguesColumn(4, value))}
        />
      ),
      colspan: 1,
      classname: sortLeaguesBy.column === 4 ? "sort" : "",
    },
  ];

  const data = filterLeagues(Object.values(leagues || {}), type1, type2)
    .filter((league) => !searchedLeague || searchedLeague === league.league_id)
    .map((league) => {
      let sortCol;
      if (sortLeaguesBy.column === 0 && sortLeaguesBy.asc) {
        sortCol = "League";
      } else {
        sortCol =
          [column1, column2, column3, column4].find(
            (col, index) => sortLeaguesBy.column === index + 1
          ) || "Index";
      }
      return {
        id: league.league_id,
        sortby: getLeaguesSortValue(
          sortCol,
          sortLeaguesBy.asc,
          league,
          ktc_current || {},
          fpseason || {},
          allplayers || {}
        ),
        columns: [
          {
            text: <Avatar id={league.avatar} type="L" text={league.name} />,
            colspan: 3,
            classname: sortLeaguesBy.column === 0 ? "sort" : "",
          },
          ...[column1, column2, column3, column4].map((col, index) => {
            const { text, trendColor } = getLeaguesColumn(
              col,
              league,
              ktc_current || {},
              fpseason || {},
              allplayers || {}
            );
            return {
              text: text,
              colspan: 1,
              style: { ...trendColor },
              classname: sortLeaguesBy.column === index + 1 ? "sort" : "",
            };
          }),
        ],
        secondaryTable: (
          <Standings
            type={2}
            league={league}
            standingsTab={standingsTab}
            standingsTab2={standingsTab2}
            setStandingsTab={(tab) => dispatch(setStandingsTab(tab))}
            setStandingsTab2={(tab) => dispatch(setStandingsTab2(tab))}
          />
        ),
      };
    })
    .sort((a, b) =>
      sortLeaguesBy.asc
        ? a.sortby > b.sortby
          ? 1
          : -1
        : a.sortby < b.sortby
        ? 1
        : -1
    );

  const content = (
    <>
      <h1>{data.length} Leagues</h1>
      <TableMain
        type={1}
        headers_sort={headers_sort}
        headers={headers}
        data={data}
        active={activeLeague}
        setActive={(league_id) => dispatch(setActiveLeague(league_id))}
        searches={[
          {
            searched: searchedLeague,
            setSearched: (searched) => dispatch(setSearchedLeague(searched)),
            options: filterLeagues(
              Object.values(leagues || {}),
              type1,
              type2
            ).map((league) => {
              return {
                id: league.league_id,
                text: league.name,
                display: (
                  <Avatar id={league.avatar} type={"L"} text={league.name} />
                ),
              };
            }),
            placeholder: "Search Leagues",
          },
        ]}
        page={page}
        setPage={(page) => dispatch(setLeaguesPage(page))}
      />
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Leagues;
