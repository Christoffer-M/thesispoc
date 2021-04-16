import * as firebaseDB from "../../database/firebaseDB";
import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Task from "../../components/Task/Task";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  async function fetchdata() {
    const tasks = await firebaseDB.getTasks();

    setTasks(tasks);
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="container">
      <div className="tasks">
        <h2 className="mainHeadline"> Your Tasks</h2>
        <div className="mainBarContainer">
          {tasks.map((item, idx) => (
            <React.Fragment key={"A" + idx}>
              <Task key={idx} progress={item.progress} name={item.name} />
              {idx === 2 && <p key={"B" + idx} className="breaker"></p>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="team">
        <h2 className="mainHeadline">Your Team</h2>
      </div>
    </div>
  );
};

export default Dashboard;
