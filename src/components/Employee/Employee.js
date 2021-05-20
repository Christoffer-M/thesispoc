import "./Employee.scss";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import React, { useEffect, useState } from "react";
import { ReactComponent as MailIcon } from "../../assets/icons/MailIcon.svg";
import { ReactComponent as MessageIcon } from "../../assets/icons/MessageIcon.svg";
import { ReactComponent as PhoneIcon } from "../../assets/icons/phoneIcon.svg";
import helpIcon from "../../assets/icons/helpIcon.webp";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getUserTasks } from "../../database/firebaseDB";

const Employee = (props) => {
  const [helpNeeded, setHelp] = useState("no");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userTasks, setUserTasks] = useState([]);

  const emp = {
    id: props.id,
    name: props.employee.name,
    imageURL: props.employee.imageURL,
    phone: props.employee.phone,
    title: props.employee.title,
    email: props.employee.email,
  };

  let task;
  if (props.task !== null && !props.isTeamPage) {
    task = {
      description: props.task.name,
      progress: props.task.progress,
      severity: props.task.severity,
    };
  }

  useEffect(() => {
    if (props.task !== null && !props.isTeamPage) {
      if (props.task.helpneeded) {
        setHelp("Yes");
      }
    }

    if (emp.email) {
      setEmail("mailto: " + emp.email);
    }

    if (emp.phone) {
      setPhone("tel: " + emp.phone);
    }

    if (props.isTeamPage) {
      async function fetchData() {
        await getUserTasks(emp.id).then((res) => {
          const tasks = res.map((task, idx) => {
            return task;
          });
          setUserTasks(tasks);
        });
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emp.email, emp.phone, props.isTeamPage]);

  function isHelpNeeded(help) {
    if (help) {
      return 10;
    } else {
      return 12;
    }
  }

  return (
    <Container className="mainEmployee">
      <Row className="d-flex">
        <Col xs={12} className="d-flex justify-content-between">
          <a className="contactLink" href={email}>
            <MailIcon />
          </a>

          <p className="contactLink">
            <MessageIcon />
          </p>
          {phone !== "" && (
            <a className="contactLink" href={phone}>
              <PhoneIcon />
            </a>
          )}
        </Col>
      </Row>
      <Row className="employeeMeta">
        <Col lg={4} xs={12} className="d-flex imageCol justify-content-center">
          <img
            src={emp.imageURL}
            alt="ImageUrl"
            className="img-fluid rounded-circle"
          />
        </Col>
        <Col className="titleContainer justify-content-center" lg={8} xs={12}>
          <h4>{emp.name}</h4>
          <h5>{emp.title} </h5>
        </Col>
      </Row>
      {props.isTeamPage === true ? (
        <Row className="progressBarContainer d-flex justify-content-center">
          <h5>Tasks:</h5>
          {userTasks.length > 0 ? (
            userTasks.map((task, idx) => {
              return (
                <React.Fragment key={idx}>
                  {task.data.helpneeded && (
                    <Col xs={2} className="helpIconContainer">
                      <img src={helpIcon} className="helpIcon" alt="helpIcon" />
                    </Col>
                  )}

                  <Col
                    xs={isHelpNeeded(task.data.helpneeded)}
                    className="progressBar"
                  >
                    <h6>{task.data.name}</h6>
                    <ProgressBar completed={task.data.progress}></ProgressBar>
                  </Col>
                </React.Fragment>
              );
            })
          ) : (
            <h6>This user has no tasks</h6>
          )}
        </Row>
      ) : (
        <Row>
          {task !== undefined ? (
            <>
              <Row className="currentWork">
                <Col xs={12}>
                  <h4>Currently working on:</h4>
                  <p>{task.description}</p>
                  <h6>Progress:</h6>
                  <ProgressBar completed={task.progress} />
                </Col>
              </Row>
              {helpNeeded === "Yes" && (
                <Row className="helpRow">
                  <Col>
                    <Button className="btn btn-warning">
                      <img src={helpIcon} className="helpIcon" alt="helpIcon" />
                      Help Needed
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <h4>Currently not assigned to a task</h4>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Employee;
