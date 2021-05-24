import "./YourWork.scss";
import React, { useState, useEffect, useRef } from "react";
import { getUserTasks, getUser } from "../../database/firebaseDB";
import { Redirect } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import Task from "../../components/Task/Task";
import TaskModal from "../../components/TaskModal/TaskModal";
import Loading from "../Loading/Loading";

const YourWork = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);
  const user = useRef(getUser());

  async function fillUserTasks() {
    if (user) {
      setLoading(true);
      setUserFound(true);
      await getUserTasks(user.current.uid)
        .then((res) => {
          res.sort(compare);
          setTasks(res);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
    const fetchdata = async () => {
      await getUserTasks(user.current.uid)
        .then((res) => {
          res.sort(compare);
          setTasks(res);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (user) {
      setUserFound(true);
      fetchdata();
    } else {
      setLoading(false);
      console.error("Could not find user");
    }
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
