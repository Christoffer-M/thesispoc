import "./YourWork.scss";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import * as firebaseDB from "../../database/firebaseDB";
import { Redirect } from "react-router";
import Task from "../../components/Task/Task";
import TaskModal from "../../components/TaskModal/TaskModal";
import Loading from "../Loading/Loading";

const YourWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);

  const fetchdata = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //Set user Tasks
        await fillUserTasks();

        setUserFound(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  async function fillUserTasks() {
    console.log("Filling user Tasks");
    await firebaseDB.getUserTasks().then((res) => {
      res.sort(compare);
      setTasks(res);
    });
    console.log("Done Filling user Tasks");
  }

  function compare(a, b) {
    console.log(a.data.progress);
    if (a.data.progress > b.data.progress) {
      return -1;
    }
    if (a.data.progress < b.data.progress) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    fetchdata();
  }, []);

  if (loading) {
    return <Loading />;
  } else if (!userFound) {
    return <Redirect to={{ pathname: "/" }} />;
  } else {
    return (
      <div className="yourWork_MainDiv">
        <div className="yourWork_Header">
          <h2>Your Tasks</h2>
          <TaskModal reloadTasks={fillUserTasks} />
        </div>

        <div className="workContainer">
          {tasks.map((val, idx) => {
            return (
              <React.Fragment key={"A" + idx}>
                <Task
                  large={true}
                  id={val.id}
                  name={val.data.name}
                  progress={val.data.progress}
                  description={val.data.description}
                  helpNeed={val.data.helpneeded}
                  reloadTasks={fillUserTasks}
                  key={idx}
                />
                {(idx + 1) % 2 === 0 && (
                  <p key={"B" + idx} className="breaker"></p>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
};

export default YourWork;
