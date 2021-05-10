import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import * as firebaseDB from "../../database/firebaseDB";
import Modal from "react-modal";
import "./Task.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Task = (props) => {
  const [helpNeed, setHelpNeed] = useState("");
  const [helpText, setHelpText] = useState("Request Help");
  const [modalIsOpen, setIsOpen] = useState(false);

  const deleteTask = async () => {
    await firebaseDB.deleteTask(props.id);
    props.reloadTasks();
    setIsOpen(false);
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    console.log("Opened");
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    Modal.setAppElement("#root");
    if (props.helpNeed) {
      setHelpNeed("Yes");
      setHelpText("Remove help Request");
    } else {
      setHelpNeed("No");
      setHelpText("Request help");
    }
  }, [props.helpNeed]);

  if (props.large) {
    return (
      <>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Delete Task"
          className="modalClass"
          overlayClassName="Overlay"
          onAfterOpen={afterOpenModal}
        >
          <h2>Are you sure you wish to delete this task?</h2>
          <div className="modalButtons">
            <button onClick={deleteTask}>Yes, I am sure</button>
            <button onClick={closeModal}>No, take me back</button>
          </div>
        </Modal>
        <Container className="d-flex flex-column justify-content-between largeTaskContainer">
          <Row>
            <Col>
              <h3>{props.name}</h3>
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>Description: </h4>
              <p>{props.description}</p>
            </Col>
          </Row>

          <Row className="progressRow">
            <Col>
              <h4>Progress: </h4>
              <ProgressBar completed={props.progress} />
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>Help requested: {helpNeed} </h4>
            </Col>
          </Row>
          <Row className="d-flex justify-content-between">
            <Col sm={12}>
              <button
                className="button request"
                onClick={async () => {
                  if (helpNeed === "Yes") {
                    firebaseDB.changeHelpRequest(props.id, false);
                    setHelpText("Request help");
                    setHelpNeed("No");
                  } else {
                    firebaseDB.changeHelpRequest(props.id, true);
                    setHelpText("Remove Request Help");
                    setHelpNeed("Yes");
                  }
                }}
              >
                {helpText}
              </button>
            </Col>
            <Col className="d-flex buttonCol" sm={12}>
              <button className="button delete" onClick={openModal}>
                Delete Task
              </button>
            </Col>
          </Row>
        </Container>
      </>
    );
  } else {
    return (
      <div className="progressBarContainer">
        <h4>{props.name}</h4>
        <ProgressBar completed={props.progress} />
      </div>
    );
  }
};

export default Task;
