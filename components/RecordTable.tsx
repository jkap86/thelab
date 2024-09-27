import { filterLeagues } from "@/helpers/filterLeagues";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const RecordTable: React.FC = () => {
  const { type1, type2 } = useSelector((state: RootState) => state.common);
  const { leagues } = useSelector((state: RootState) => state.user);

  const record = useMemo(() => {
    return filterLeagues(Object.values(leagues || {}), type1, type2).reduce(
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
  }, [leagues, type1, type2]);
  return (
    <table className="record">
      <thead>
        <tr>
          <th>Record</th>
          <th>Win %</th>
          <th>FP</th>
          <th>FPA</th>
        </tr>
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
  );
};

export default RecordTable;
