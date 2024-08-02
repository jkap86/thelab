"use client";
import Avatar from "@/components/Avatar";
import HeaderDropdown from "@/components/HeaderDropdown";
import Layout from "@/components/Layout";
import TableMain from "@/components/TableMain";
import { getLeaguematesColumn } from "@/helpers/getLeaguematesColumn";
import {
  setLeaguematesColumn,
  setLeaguematesPage,
  setSortLeaguematesBy,
} from "@/redux/actions/leaguematesActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getSortIcon } from "@/helpers/getSortIcon";

interface LeaguematesProps {
  params: { username: string };
}

const Leaguemates: React.FC<LeaguematesProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2 } = useSelector((state: RootState) => state.common);
  const { leagues, leaguemates } = useSelector(
    (state: RootState) => state.user
  );
  const { column1, column2, column3, column4, sortLmBy, page } = useSelector(
    (state: RootState) => state.leaguemates
  );

  const columnOptions = [{ text: "# Common Leagues", abbrev: "# C L" }];

  const headers_sort = [
    {
      text: getSortIcon(0, sortLmBy, (colNum, asc) =>
        dispatch(setSortLeaguematesBy(colNum, asc))
      ),
      colspan: 3,
    },
    {
      text: getSortIcon(1, sortLmBy, (colNum, asc) =>
        dispatch(setSortLeaguematesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(2, sortLmBy, (colNum, asc) =>
        dispatch(setSortLeaguematesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(3, sortLmBy, (colNum, asc) =>
        dispatch(setSortLeaguematesBy(colNum, asc))
      ),
      colspan: 1,
    },
    {
      text: getSortIcon(4, sortLmBy, (colNum, asc) =>
        dispatch(setSortLeaguematesBy(colNum, asc))
      ),
      colspan: 1,
    },
  ];

  const headers = [
    {
      text: <>Leaguemate</>,
      colspan: 3,
      classname: sortLmBy.column === 0 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column1}
          setColumnText={(value) => dispatch(setLeaguematesColumn(1, value))}
        />
      ),
      colspan: 1,
      classname: sortLmBy.column === 1 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column2}
          setColumnText={(value) => dispatch(setLeaguematesColumn(2, value))}
        />
      ),
      colspan: 1,
      classname: sortLmBy.column === 2 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column3}
          setColumnText={(value) => dispatch(setLeaguematesColumn(3, value))}
        />
      ),
      colspan: 1,
      classname: sortLmBy.column === 3 ? "sort" : "",
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions}
          columnText={column4}
          setColumnText={(value) => dispatch(setLeaguematesColumn(4, value))}
        />
      ),
      colspan: 1,
      classname: sortLmBy.column === 4 ? "sort" : "",
    },
  ];

  const data = Object.keys(leaguemates).map((lm_user_id, index) => {
    return {
      id: `${lm_user_id}_${index}`,
      columns: [
        {
          text: (
            <Avatar
              id={leaguemates[lm_user_id].avatar}
              type="U"
              text={leaguemates[lm_user_id].username}
            />
          ),
          colspan: 3,
        },
        ...[column1, column2, column3, column4].map((col, index) => {
          const { text, trendColor } = getLeaguematesColumn(
            col,
            leaguemates[lm_user_id].leagues,
            leagues || {},
            type1,
            type2
          );

          return {
            text: text,
            colspan: 1,
            style: { ...trendColor },
            classname: sortLmBy.column === index + 1 ? "sort" : "",
          };
        }),
      ],
    };
  });

  const content = (
    <>
      <TableMain
        type={1}
        headers_sort={headers_sort}
        headers={headers}
        data={data}
        page={page}
        setPage={(value) => dispatch(setLeaguematesPage(value))}
      />
    </>
  );
  return <Layout username={params.username} content={content} />;
};

export default Leaguemates;
