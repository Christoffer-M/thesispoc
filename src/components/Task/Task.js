import ProgressBar from "../Progress-Bar/Progress-Bar";
import "./Task.scss";

const Task = (props) => {
  console.log(props.name, props.progress);

  return (
    <div className="progressBarContainer">
      <h4>{props.name}</h4>
      <ProgressBar completed={props.progress} />
    </div>
  );
};

export default Task;
