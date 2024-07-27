"use client";
import HeaderDropdown from "@/components/HeaderDropdown";
import Layout from "@/components/Layout";
import TableMain from "@/components/TableMain";
import {
  setActivePlayer,
  setPlayersColumn,
  setPlayersPage,
  setSearchedPlayer,
} from "@/redux/actions/playersActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getSortIcon } from "@/helpers/getSortIcon";
import { setSortPlayersBy } from "@/redux/actions/playersActions";
import {
  getPlayersColumn,
  getPlayersSortValue,
} from "@/helpers/getPlayersColumn";
import Avatar from "@/components/Avatar";
import PlayerLeagues from "@/components/PlayerLeagues";

interface PlayersProps {
  params: { username: string };
}

const Players: React.FC<PlayersProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current, type1, type2 } = useSelector(
    (state: RootState) => state.common
  );
  const { playershares, leagues } = useSelector(
    (state: RootState) => state.user
  );
  const {
    column1,
    column2,
    column3,
    column4,
    sortPlayersBy,
    searchedPlayer,
    activePlayer,
    page,
  } = useSelector((state: RootState) => state.players);

  const columnOptions = [
    { text: "# Owned", abbrev: "# Own" },
    { text: "% Owned", abbrev: "% Own" },
    { text: "% Available", abbrev: "% Avail" },
    { text: "Age", abbrev: "Age" },
    { text: "KTC Dynasty Value", abbrev: "KTC" },
  ];

  const headers_sort = [
    {
      text: getSortIcon(0, sortPlayersBy, (colNum, asc) =>
        dispatch(setSortPlayersBy(colNum, asc))
      ),
      colspan: 3,
    },
    {
      text: getSortIcon(1, sortPlayersBy, (colNum, asc) =>
        dispatch(setSortPlayersBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(2, sortPlayersBy, (colNum, asc) =>
        dispatch(setSortPlayersBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(3, sortPlayersBy, (colNum, asc) =>
        dispatch(setSortPlayersBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(4, sortPlayersBy, (colNum, asc) =>
        dispatch(setSortPlayersBy(colNum, asc))
      ),
      colspan: 1,
    },
  ];

  const headers = [
    {
      text: <>Player</>,
      colspan: 3,
      classname: sortPlayersBy.column === 0 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          columnText={column1}
          setColumnText={(value) => dispatch(setPlayersColumn(1, value))}
          options={columnOptions}
        />
      ),
      colspan: 1,
      classname: sortPlayersBy.column === 1 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          columnText={column2}
          setColumnText={(value) => dispatch(setPlayersColumn(2, value))}
          options={columnOptions}
        />
      ),
      colspan: 1,
      classname: sortPlayersBy.column === 2 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          columnText={column3}
          setColumnText={(value) => dispatch(setPlayersColumn(3, value))}
          options={columnOptions}
        />
      ),
      colspan: 1,
      classname: sortPlayersBy.column === 3 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          columnText={column4}
          setColumnText={(value) => dispatch(setPlayersColumn(4, value))}
          options={columnOptions}
        />
      ),
      colspan: 1,
      classname: sortPlayersBy.column === 4 ? "sort" : "",
    },
  ];

  const data = Object.keys(playershares)
    .filter(
      (player_id) =>
        allplayers &&
        allplayers[player_id].full_name &&
        (!searchedPlayer || searchedPlayer === player_id)
    )
    .map((player_id, index) => {
      let sortCol;
      if (sortPlayersBy.column === 0) {
        sortCol = "Player";
      } else {
        sortCol =
          [column1, column2, column3, column4].find(
            (col, index) => sortPlayersBy.column === index + 1
          ) || "Index";
      }
      return {
        id: player_id,
        sortby:
          allplayers &&
          getPlayersSortValue(
            sortCol,
            allplayers[player_id],
            playershares[player_id],
            leagues,
            ktc_current || {},
            type1,
            type2
          ),
        columns: [
          {
            text:
              (allplayers && (
                <Avatar
                  id={player_id}
                  type={"P"}
                  text={allplayers[player_id].full_name}
                />
              )) ||
              "-",
            colspan: 3,
            classname: sortPlayersBy.column === 0 ? "sort" : "",
          },
          ...[column1, column2, column3, column4].map((col, index) => {
            let text, trendColor;
            if (allplayers) {
              ({ text, trendColor } = getPlayersColumn(
                col,
                allplayers[player_id],
                playershares[player_id],
                leagues,
                ktc_current || {},
                type1,
                type2
              ));
            }
            return {
              text: text,
              colspan: 1,
              style: { ...trendColor },
              classname: sortPlayersBy.column === index + 1 ? "sort" : "",
            };
          }),
        ],
        secondaryTable: (
          <PlayerLeagues
            type={2}
            player_id={player_id}
            owned={playershares[player_id].owned}
            taken={playershares[player_id].taken}
            available={playershares[player_id].available}
          />
        ),
      };
    })
    .sort((a, b) =>
      sortPlayersBy.asc
        ? a.sortby > b.sortby
          ? 1
          : -1
        : a.sortby < b.sortby
        ? 1
        : -1
    );

  const content = (
    <>
      <TableMain
        type={1}
        headers_sort={headers_sort}
        headers={headers}
        data={data}
        page={page}
        setPage={(page) => dispatch(setPlayersPage(page))}
        active={activePlayer}
        setActive={(player_id) => dispatch(setActivePlayer(player_id))}
        searches={[
          {
            searched: searchedPlayer,
            setSearched: (searched) => dispatch(setSearchedPlayer(searched)),
            options: Object.keys(playershares).map((player_id) => {
              return {
                id: player_id,
                text: (allplayers && allplayers[player_id].full_name) || "",
                display: (
                  <Avatar
                    id={player_id}
                    type="P"
                    text={(allplayers && allplayers[player_id].full_name) || ""}
                  />
                ),
              };
            }),
            placeholder: "Search Players",
          },
        ]}
      />
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Players;
