import * as firebaseDB from "../../database/firebaseDB";
import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Task from "../../components/Task/Task";
import { Redirect } from "react-router";
import Loading from "../Loading/Loading";
import Employee from "../../components/Employee/Employee";
import TaskModal from "../../components/TaskModal/TaskModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [userImage, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);

  const fetchdata = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //Set user Image based on Google Image
        setImage(user.photoURL);

        //Set user Tasks
        await fillUserTasks();

        //Set Team
        await fillTeamMembers();

        setUserFound(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  async function fillUserTasks() {
    console.log("Filling user Tasks");
    await firebaseDB.getUserTasks().then((res) => {
      res.sort(compare);
      setTasks(res);
    });
    console.log("Done Filling user Tasks");
  }

  function compare(a, b) {
    if (a.data.progress > b.data.progress) {
      return -1;
    }
    if (a.data.progress < b.data.progress) {
      return 1;
    }
    return 0;
  }

  async function fillTeamMembers() {
    await firebaseDB.getEmployees().then(async (res) => {
      const currentTeam = [];

      for (const emp of res) {
        const currentTaskID = emp.data.currentTask.trim();
        await firebaseDB.getTask(currentTaskID).then((res) => {
          currentTeam.push({ employee: emp.data, currentTask: res });
        });
      }
      setTeam(currentTeam);
    });
  }

  if (loading) {
    return <Loading />;
  } else if (!userFound) {
    return <Redirect to={{ pathname: "/" }} />;
  } else {
    return (
      <div>
        <div className="tasks">
          <div className="taskHeader">
            <img className="userImage" src={userImage} alt="userImage" />
            <h2 className="mainHeadline"> Your Tasks</h2>
            <TaskModal reloadTasks={fillUserTasks} />
          </div>

          <div className="mainBarContainer">
            {tasks.map((item, idx) => {
              return (
                <React.Fragment key={"A" + idx}>
                  <Task
                    key={idx}
                    progress={item.data.progress}
                    name={item.data.name}
                  />
                  {(idx + 1) % 3 === 0 && (
                    <p key={"B" + idx} className="breaker"></p>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="team">
          <h2 className="mainHeadline">Your Team</h2>
          <div className="teamMembers">
            {team.map((item, idx) => {
              if (item.employee) {
                console.log(idx);
                return (
                  <Employee
                    employee={item.employee}
                    key={idx}
                    task={item.currentTask}
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
