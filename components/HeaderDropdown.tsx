type SetColumnText = (text: string) => void;

interface HeaderDropdownProps {
  options: { text: string; abbrev: string }[];
  columnText: string;
  setColumnText: SetColumnText;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  options,
  columnText,
  setColumnText,
}) => {
  return (
    <div className="headerdropdown">
      <div className="columnText">
        {columnText}
        <select
          className="hidden"
          value={columnText}
          onChange={(e) => setColumnText(e.target.value)}
        >
          {options.map((option) => {
            return (
              <option key={option.text} value={option.abbrev}>
                {option.text}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default HeaderDropdown;
