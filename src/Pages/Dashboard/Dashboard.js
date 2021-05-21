import * as firebaseDB from "../../database/firebaseDB";
import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import Task from "../../components/Task/Task";
import { Redirect } from "react-router";
import Loading from "../Loading/Loading";
import Employee from "../../components/Employee/Employee";
import TaskModal from "../../components/TaskModal/TaskModal";
import { Container, Row, Col } from "react-bootstrap";

let userID;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [userImage, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);

  useEffect(() => {
    const user = firebaseDB.getUser();
    async function fetchData() {
      if (user) {
        //Set user Image based on Google Image
        setImage(user.photoURL);
        userID = user.uid;
        //Set user Tasks
        fillUserTasks().then(() => {
          fillTeamMembers().then(() => {
            setUserFound(true);
            setLoading(false);
          });
        });

        //Set Team
      } else {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fillUserTasks() {
    await firebaseDB
      .getMyTasks()
      .then((res) => {
        res.sort(compare);
        setTasks(res);
      })
      .catch((err) => {
        console.error("Could not fill user Tasks", err);
      });
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
        if (emp.id !== userID) {
          await firebaseDB.getAssignedTask(emp.id).then((res) => {
            if (res !== undefined) {
              currentTeam.push({ employee: emp.data, currentTask: res });
            } else {
              currentTeam.push({ employee: emp.data, currentTask: null });
            }
          });
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
      <React.Fragment>
        <Container>
          <Row>
            <Col xs={12} className="d-flex align-items-center">
              <img
                className="img-fluid img-thumbnail taskImage"
                src={userImage}
                alt="userImage"
              />
              <h2 className="mainHeadline"> Your Tasks</h2>
              <TaskModal
                reloadTasks={fillUserTasks}
                reloadTeam={fillTeamMembers}
              />
            </Col>
          </Row>
          <Row className="dashTasks">
            {tasks.map((item, idx) => {
              return (
                <Col xl={4} md={6} xs={12} key={idx}>
                  <Task key={idx} taskObject={item.data} />
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
      </React.Fragment>
    );
  }
};

export default Dashboard;
