import "./YourWork.scss";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import * as firebaseDB from "../../database/firebaseDB";
import { Redirect } from "react-router";
import Task from "../../components/Task/Task";
import TaskModal from "../../components/TaskModal/TaskModal";
import Loading from "../Loading/Loading";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const YourWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);

  const fetchdata = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        //Set user Tasks
        await fillUserTasks(user.uid);

        setUserFound(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  async function fillUserTasks(id) {
    console.log("Filling user Tasks");
    await firebaseDB.getUserTasks(id).then((res) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  } else if (!userFound) {
    return <Redirect to={{ pathname: "/" }} />;
  } else {
    return (
      <Container className="yourWork_MainDiv">
        <Row className="yourWork_Header">
          <Col className="d-flex">
            <h2>Your Work</h2>
            <TaskModal reloadTasks={fillUserTasks} />
          </Col>
        </Row>

        <Row>
          {tasks.map((val, idx) => {
            return (
              <Col lg={4} xs={12} className="taskCol" key={idx}>
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
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
};

export default YourWork;
