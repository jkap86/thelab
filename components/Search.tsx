import React, { useState } from "react";
import "@/styles/search.css";
type SetSearched = (searched: string) => void;

interface Option {
  id: string;
  text: string;
  display: JSX.Element;
}

interface SearchProps {
  searched: string | false;
  setSearched: SetSearched;
  options: Option[];
  placeholder: string;
}

const Search: React.FC<SearchProps> = ({
  searched,
  setSearched,
  options,
  placeholder,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Option[]>([]);

  const handleSearch = (input: string) => {
    const match = options.find(
      (x: Option) => x.text.trim().toLowerCase() === input.trim().toLowerCase()
    );
    if (input.trim() === "") {
      setSearchText("");
      setSearched("");
      setSearchOptions([]);
    } else if (match) {
      setSearchText(match.text);
      setSearched(match.id);
      setSearchOptions([]);
    } else {
      setSearchText(input);

      const filteredOptions: Option[] = options.filter((option: Option) =>
        option.text.toLowerCase().trim().includes(input.trim().toLowerCase())
      );

      setSearchOptions(filteredOptions);
    }
  };

  return (
    <div className="search_container">
      <input
        className="search"
        type="text"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
      />
      {(searchText !== "" && (
        <button className="clear" onClick={() => handleSearch("")}>
          x
        </button>
      )) ||
        null}
      {searchOptions.length > 0 && (
        <ol className="options">
          {searchOptions.map((option: Option, index) => {
            return (
              <li
                key={`${option.id}_${index}`}
                onClick={() => handleSearch(option.text)}
              >
                {option.display}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default Search;
