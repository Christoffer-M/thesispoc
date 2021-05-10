import "./Employee.scss";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import { useEffect, useState } from "react";
import MailIcon from "../../assets/icons/MailIcon.png";
import messageIcon from "../../assets/icons/MessageIcon.png";
import phoneIcon from "../../assets/icons/phoneIcon.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Employee = (props) => {
  const [helpNeeded, setHelp] = useState("no");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const emp = {
    name: props.employee.name,
    imageURL: props.employee.imageURL,
    phone: props.employee.phone,
    title: props.employee.title,
    email: props.employee.email,
  };

  let task;
  if (props.task !== null) {
    console.log(props.task.name);
    task = {
      description: props.task.name,
      progress: props.task.progress,
    };
  }

  useEffect(() => {
    if (props.task !== null) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emp.email, emp.phone]);

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
                <h3>Currently working on:</h3>
                <p>{task.description}</p>
              </Col>

              <Col xs={12}>
                <h3>Progress:</h3>
                <ProgressBar completed={task.progress} />
              </Col>
            </Row>
            <Row className="helpNeeded">
              <Col>
                <h3>Looking for advice</h3>
                <p>{helpNeeded}</p>
              </Col>
            </Row>
          </>
        ) : (
          <h3>Currently not assigned to a task</h3>
        )}
      </div>
    </Container>
  );
};

export default Employee;
