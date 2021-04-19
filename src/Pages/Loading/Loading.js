import BounceLoader from "react-spinners/BounceLoader";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loadMain">
      <BounceLoader color={"#185a9d"} />
    </div>
  );
};

export default Loading;
