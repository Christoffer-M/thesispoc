import * as firebaseDB from "../../database/firebaseDB";
import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Task from "../../components/Task/Task";
import { Redirect } from "react-router";
import Loading from "../Loading/Loading";
import Employee from "../../components/Employee/Employee";
import TaskModal from "../../components/TaskModal/TaskModal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [userImage, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);
  let userID;

  const fetchdata = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //Set user Image based on Google Image
        setImage(user.photoURL);
        userID = user.uid;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fillUserTasks() {
    console.log("Filling user Tasks");
    await firebaseDB
      .getMyTasks()
      .then((res) => {
        res.sort(compare);
        setTasks(res);
      })
      .catch((err) => {
        console.error("Could not fill user Tasks", err);
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
        let currentTaskID;
        if (emp.id !== userID) {
          if (
            emp.data.currentTask !== undefined &&
            emp.data.currentTask !== ""
          ) {
            currentTaskID = emp.data.currentTask.trim();
            await firebaseDB.getTask(currentTaskID).then((res) => {
              currentTeam.push({ employee: emp.data, currentTask: res });
            });
          } else {
            currentTeam.push({ employee: emp.data, currentTask: null });
          }
        }
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
      <Container>
        <Row>
          <Col xs={12} className="d-flex align-items-center">
            <img
              className="img-fluid img-thumbnail taskImage"
              src={userImage}
              alt="userImage"
            />
            <h2 className="mainHeadline"> Your Tasks</h2>
            <TaskModal reloadTasks={fillUserTasks} />
          </Col>
        </Row>
        <Row className="dashTasks">
          {tasks.map((item, idx) => {
            return (
              <Col xl={4} md={6} xs={12} key={idx}>
                <Task
                  key={idx}
                  progress={item.data.progress}
                  name={item.data.name}
                />
                {(idx + 1) % 3 === 0 && (
                  <p key={"B" + idx} className="breaker"></p>
                )}
              </Col>
            );
          })}
        </Row>
        <Row className="team">
          <h2 className="mainHeadline">Your Team</h2>
          {team.map((item, idx) => {
            if (item.employee) {
              return (
                <Col
                  xl={4}
                  md={6}
                  xs={12}
                  key={idx}
                  className="employeeContainer"
                >
                  <Employee
                    employee={item.employee}
                    key={idx}
                    task={item.currentTask}
                  />
                </Col>
              );
            } else {
              return null;
            }
          })}
        </Row>
      </Container>
    );
  }
};

export default Dashboard;
