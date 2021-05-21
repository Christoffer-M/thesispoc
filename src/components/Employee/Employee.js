import "./Employee.scss";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import React, { useEffect, useState } from "react";
import { ReactComponent as MailIcon } from "../../assets/icons/MailIcon.svg";
import { ReactComponent as MessageIcon } from "../../assets/icons/MessageIcon.svg";
import { ReactComponent as PhoneIcon } from "../../assets/icons/phoneIcon.svg";
import { Container, Row, Col } from "react-bootstrap";
import { getUserTasks } from "../../database/firebaseDB";
import AdviceModal from "../AdviceModal/AdviceModal";

const Employee = (props) => {
  const [helpNeeded, setHelp] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userTasks, setUserTasks] = useState([]);
  const [task, setTask] = useState(null);

  const emp = {
    id: props.id,
    name: props.employee.name,
    imageURL: props.employee.imageURL,
    phone: props.employee.phone,
    title: props.employee.title,
    email: props.employee.email,
  };

  useEffect(() => {
    if (props.task && !props.isTeamPage) {
      setTask(props.task);
      if (props.task.data.helpNeeded) {
        setHelp(true);
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
      <Row>
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
        <div className="d-flex employeeMeta">
          <Col xs={4} className="d-flex imageCol justify-content-center h-100">
            <img
              src={emp.imageURL}
              alt="ImageUrl"
              className="img-fluid rounded-circle"
            />
          </Col>
          <Col
            className="titleContainer justify-content-center"
            xs={8}
            style={{ paddingLeft: 10 }}
          >
            <h4>{emp.name}</h4>
            <h5>{emp.title} </h5>
          </Col>
        </div>

        {props.isTeamPage === true ? (
          <Col className="progressBarContainer d-flex flex-column justify-content-center">
            <h5>Tasks:</h5>
            {userTasks.length > 0 ? (
              userTasks.map((task, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <AdviceModal
                      large={false}
                      task={task.data}
                      isHelpNeeded={isHelpNeeded}
                    />
                  </React.Fragment>
                );
              })
            ) : (
              <h6>This user has no tasks</h6>
            )}
          </Col>
        ) : (
          <div className="d-flex flex-column">
            {task !== null ? (
              <>
                <div>
                  <Col xs={12} className="currentWork">
                    <h4>Currently working on:</h4>
                    <p>{task.data.description}</p>
                  </Col>
                </div>
                <div>
                  <Col xs={12}>
                    <h6>Progress:</h6>
                    <ProgressBar completed={task.data.progress} />
                  </Col>
                </div>

                {helpNeeded && (
                  <Col className="helpRow">
                    <AdviceModal large={true} task={task.data} />
                  </Col>
                )}
              </>
            ) : (
              <h4>Currently not assigned to a task</h4>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Employee;
