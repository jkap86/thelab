import Search from "./Search";
import "../styles/tableMain.css";
import { useEffect } from "react";

type ClickHandler = (id: any) => void;

type SetPage = (page: number) => void;

type SetSearched = (searched: string) => void;

interface Option {
  id: string;
  text: string;
  display: JSX.Element;
}

interface TableMainProps {
  type: number;
  headers: {
    text: JSX.Element | string;
    colspan: number;
    classname?: string;
  }[];
  headers_sort?: { text: JSX.Element | string; colspan: number }[];
  data: any[];
  half?: boolean;
  active?: any;
  setActive?: ClickHandler;
  caption?: JSX.Element;
  page?: number;
  setPage?: SetPage;
  searches?: {
    searched: string | false;
    setSearched: SetSearched;
    options: Option[];
    placeholder: string;
  }[];
}

const TableMain: React.FC<TableMainProps> = ({
  type,
  headers,
  headers_sort,
  data,
  half,
  active,
  setActive,
  caption,
  page,
  setPage,
  searches,
}) => {
  const body = page ? data.slice((page - 1) * 25, (page - 1) * 25 + 25) : data;

  useEffect(() => {
    if (data.length <= 25) {
      setPage && setPage(1);
    }
  }, [data]);

  return (
    <>
      {searches && (
        <div className="searches">
          {searches.map((search) => {
            return (
              <div key={search.placeholder}>
                <Search
                  searched={search.searched}
                  setSearched={search.setSearched}
                  options={search.options}
                  placeholder={search.placeholder}
                />
              </div>
            );
          })}
        </div>
      )}

      {page ? (
        <div className="page_numbers_wrapper">
          <ol className="page_numbers">
            {Array.from(Array(Math.ceil(data?.length / 25 || 0)).keys()).map(
              (key) => {
                return (
                  <li
                    key={key + 1}
                    className={page === key + 1 ? "active" : ""}
                    onClick={() => setPage && setPage(key + 1)}
                  >
                    {key + 1}
                  </li>
                );
              }
            )}
          </ol>
        </div>
      ) : null}
      <table
        className={
          "main " +
          ((half && "half ") || "") +
          (type === 1 ? "summary" : type === 2 ? "detail" : "detail2")
        }
      >
        <caption>{caption && caption}</caption>
        <thead className="main_heading">
          {headers_sort && (
            <tr>
              {headers_sort.map((h, index) => {
                return (
                  <th key={index} colSpan={h.colspan} className="sort_header">
                    {h.text}
                  </th>
                );
              })}
            </tr>
          )}
          <tr>
            {headers.map((h, index) => {
              return (
                <th
                  key={index}
                  colSpan={h.colspan}
                  className={"main_header " + h.classname}
                >
                  {h.text}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {body.length > 0 ? (
            body.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={active === row.id && half ? "sticky" : ""}
                >
                  <td
                    colSpan={headers.reduce((acc, cur) => acc + cur.colspan, 0)}
                  >
                    <table className="main_content">
                      <tbody>
                        <tr
                          className={active === row.id ? "active" : ""}
                          onClick={() =>
                            setActive &&
                            (active === row.id
                              ? setActive("")
                              : setActive(row.id))
                          }
                        >
                          {row.columns.map(
                            (
                              col: {
                                text: string;
                                colspan: number;
                                classname: string;
                                style?: { [key: string]: any };
                              },
                              index: number
                            ) => {
                              return (
                                <td
                                  key={index}
                                  colSpan={col.colspan}
                                  className={"content " + col.classname}
                                  style={col.style}
                                >
                                  <div>{col.text}</div>
                                </td>
                              );
                            }
                          )}
                        </tr>
                      </tbody>
                      {active === row.id && (
                        <tbody>
                          <tr className="detail">
                            <td
                              colSpan={headers.reduce(
                                (acc, cur) => acc + cur.colspan,
                                0
                              )}
                            >
                              {row.secondaryTable}
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.reduce((acc, cur) => acc + cur.colspan, 0)}>
                <table className="main_content">
                  <tbody>
                    <tr>
                      <td className="content">---</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {page ? (
        <div className="page_numbers_wrapper">
          <ol className="page_numbers">
            {Array.from(Array(Math.ceil(data?.length / 25 || 0)).keys()).map(
              (key) => {
                return (
                  <li
                    key={key + 1}
                    className={page === key + 1 ? "active" : ""}
                    onClick={() => setPage && setPage(key + 1)}
                  >
                    {key + 1}
                  </li>
                );
              }
            )}
          </ol>
        </div>
      ) : null}
    </>
  );
};

export default TableMain;
