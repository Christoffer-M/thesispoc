import "./YourWork.scss";
import React, { useState, useEffect } from "react";
import { getUserTasks, getUser } from "../../database/firebaseDB";
import { Redirect } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import Task from "../../components/Task/Task";
import TaskModal from "../../components/TaskModal/TaskModal";
import Loading from "../Loading/Loading";

let userID = null;

const YourWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);
  const fetchdata = async () => {
    const user = getUser();
    if (user) {
      userID = user.uid;
      await fillUserTasks(user.uid).then(() => {
        setUserFound(true);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  async function fillUserTasks() {
    await getUserTasks(userID).then((res) => {
      res.sort(compare);
      setTasks(res);
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
      <React.Fragment>
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
                    taskObject={val.data}
                    reloadTasks={fillUserTasks}
                    key={idx}
                  />
                </Col>
              );
            })}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
};

export default YourWork;
