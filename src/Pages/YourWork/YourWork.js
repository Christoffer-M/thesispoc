import "./YourWork.scss";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import * as firebaseDB from "../../database/firebaseDB";
import { Redirect } from "react-router";
import Task from "../../components/Task/Task";
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
    if (a.progress > b.progress) {
      return -1;
    }
    if (a.progress < b.progress) {
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
      <div class="yourWork_MainDiv">
        <h2>Your Tasks</h2>
        <div className="workContainer">
          {tasks.map((val, idx) => {
            return (
              <React.Fragment key={"A" + idx}>
                <Task
                  large={true}
                  name={val.name}
                  progress={val.progress}
                  description={val.description}
                  helpNeed={val.helpneeded}
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
