import "./Employee.scss";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import { useEffect, useState } from "react";
import MailIcon from "../../assets/icons/MailIcon.png";
import messageIcon from "../../assets/icons/MessageIcon.png";
import phoneIcon from "../../assets/icons/phoneIcon.png";
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
    console.log(props.task.name);
    task = {
      description: props.task.name,
      progress: props.task.progress,
      severity: props.task.severity,
    };
  }

  useEffect(() => {
    console.log(props.task);
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
            console.log(task);
            return task;
          });
          console.log(tasks);
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

  if (props.isTeamPage) {
    return (
      <Container className="d-flex mainEmployeeTeam flex-column">
        <Row className="d-flex justify-content-between">
          <Col xs="auto">
            <a className="contactLink" href={email}>
              <img src={MailIcon} alt="MailIcon" />
            </a>
          </Col>
          <Col xs="auto">
            <p className="contactLink">
              <img src={messageIcon} alt="MessageIcon" />
            </p>
          </Col>
          <Col xs="auto">
            <a className="contactLink" href={phone}>
              <img src={phoneIcon} alt="PhoneIcon" />
            </a>
          </Col>
        </Row>
        <Row className="d-flex flex-column">
          <Col className="imageContainer" xs={12}>
            <img src={emp.imageURL} className="img-fluid" alt="teamImage"></img>
          </Col>

          <Col className="titleContainer" xs={12}>
            <h2>{emp.name}</h2>
            <h5>{emp.title} </h5>
          </Col>
          <Row className="progressBarContainer d-flex justify-content-center">
            <h5>Tasks:</h5>
            {userTasks.length > 0 ? (
              userTasks.map((task, idx) => {
                return (
                  <>
                    {task.data.helpneeded && (
                      <Col xs={2} className="helpIconContainer">
                        <img
                          src={helpIcon}
                          className="helpIcon"
                          alt="helpIcon"
                        />
                      </Col>
                    )}

                    <Col
                      xs={isHelpNeeded(task.data.helpneeded)}
                      key={idx}
                      className="progressBar"
                    >
                      <h6>{task.data.name}</h6>
                      <ProgressBar completed={task.data.progress}></ProgressBar>
                    </Col>
                  </>
                );
              })
            ) : (
              <h6>This user has no tasks</h6>
            )}
          </Row>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container className="mainEmployee">
        <div className="employeeData">
          <Row className="d-flex align-items-center justify-content-between">
            <Col xs="auto">
              <a className="contactLink" href={email}>
                <img src={MailIcon} alt="MailIcon" />
              </a>
            </Col>
            <Col xs="auto">
              <p className="contactLink">
                <img src={messageIcon} alt="MessageIcon" />
              </p>
            </Col>
            <Col xs="auto">
              <a className="contactLink" href={phone}>
                <img src={phoneIcon} alt="PhoneIcon" />
              </a>
            </Col>
          </Row>
          <Row className="d-flex employeeMeta align-items-center justify-content-start">
            <Col
              lg={6}
              sm={12}
              className="d-flex imageCol justify-content-center"
            >
              <img src={emp.imageURL} alt="ImageUrl" className="img-fluid" />
            </Col>
            <Col lg={6} sm={12}>
              <h2>{emp.name}</h2>
            </Col>
          </Row>
          {task !== undefined ? (
            <>
              <Row className="currentWork">
                <Col xs={12}>
                  <h4>Currently working on:</h4>
                  <p>{task.description}</p>
                </Col>

                <Col xs={12} className="progressBarContainer">
                  <h4>Progress:</h4>
                  <ProgressBar completed={task.progress} />
                </Col>
              </Row>
              {helpNeeded === "fasdfassd" && (
                <Row className="helpNeeded">
                  <Col xs={12} className="d-flex align-items-center">
                    <h4>Help Needed:</h4>
                    <h5> {helpNeeded}</h5>
                  </Col>
                  <Col xs={12} className="d-flex align-items-center">
                    <h4>Severity:</h4>
                    <h5>{task.severity}</h5>
                  </Col>
                </Row>
              )}
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
        </div>
      </Container>
    );
  }
};

export default Employee;
