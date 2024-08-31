import Image from "next/image";
import loading_flask from "../public/images/loading_flask.png";
import bubble1 from "../public/images/bubble1.png";
import "@/styles/loadingIcon.css";

const LoadingIcon: React.FC = () => {
  return (
    <div className="loading">
      <Image className="loading_flask" src={loading_flask} alt="loading icon" />

      {Array.from(Array(25).keys()).map((key) => {
        const className = "z _" + (key + 1);
        return (
          <div className={className} key={key}>
            <Image className={className} src={bubble1} alt={"bubble1"} />
          </div>
        );
      })}
    </div>
  );
};
export default LoadingIcon;
