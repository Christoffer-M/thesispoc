import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import "./Task.scss";

const Task = (props) => {
  const [helpNeed, setHelpNeed] = useState("");

  useEffect(() => {
    if (props.helpNeed) {
      setHelpNeed("Yes");
    } else {
      setHelpNeed("No");
    }
  }, []);
  if (props.large) {
    return (
      <div className="largeTaskContainer">
        <h3>{props.name}</h3>
        <div className="descriptionDiv">
          <h4>Description: </h4>
          <p>{props.description}</p>
        </div>

        <div className="progressDiv">
          <h4>Progress: </h4>
          <ProgressBar completed={props.progress} />
        </div>

        <div class="helpDiv">
          <h4>Help requested: {helpNeed} </h4>
        </div>
      </div>
    );
  } else {
    return (
      <div className="progressBarContainer">
        <h4>{props.name}</h4>
        <ProgressBar completed={props.progress} />
      </div>
    );
  }
};

export default Task;
