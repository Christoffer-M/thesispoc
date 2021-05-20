import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import * as firebaseDB from "../../database/firebaseDB";
import Modal from "react-modal";
import "./Task.scss";
import { Container, Row, Col } from "react-bootstrap";
import HelpModal from "../HelpModal/HelpModal";
import CustomButton from "../Button/CustomButton";
import React from "react";

const Task = ({ id, large, taskObject, reloadTasks }) => {
  const [helpNeed, setHelpNeed] = useState(taskObject.helpNeeded);
  const [helpDescriptionState, setHelpDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const deleteTask = async () => {
    await firebaseDB.deleteTask(id);
    reloadTasks();
    setIsOpen(false);
  };

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    Modal.setAppElement("#root");
    if (helpNeed) {
      setHelpDescription(taskObject.helpDescription);
      setSeverity(taskObject.severity);
    }
  }, [
    helpNeed,
    taskObject.helpDescription,
    taskObject.helpNeed,
    taskObject.helpNeeded,
    taskObject.severity,
  ]);

  if (large) {
    return (
      <React.Fragment>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Delete Task"
          className="modalClass"
          overlayClassName="Overlay"
          onAfterOpen={afterOpenModal}
        >
          <h2>Are you sure you wish to delete this task?</h2>
          <Row className="modalButtons">
            <Col xs={6}>
              <CustomButton onClick={deleteTask} buttonText="Yes, I am sure" />
            </Col>
            <Col>
              <CustomButton
                color="blue"
                onClick={closeModal}
                buttonText="No, take me back"
              />
            </Col>
          </Row>
        </Modal>
        <Container className="d-flex largeTaskContainer">
          <Row className="flex-fill">
            <Col xs={12}>
              <h3>{taskObject.name}</h3>
            </Col>

            <Col xs={12}>
              <h4>Description: </h4>
              <p>{taskObject.description}</p>

              <Col className="progressRow" xs={12}>
                <h4>Progress: </h4>
                <ProgressBar completed={taskObject.progress} />
              </Col>
              {helpNeed && (
                <Col xs="auto">
                  <h4>Advice requested </h4>
                  <p>
                    {helpDescriptionState} {severity}
                  </p>
                </Col>
              )}
            </Col>

            <Col xs={12} className="d-flex flex-column justify-content-end">
              <HelpModal
                helpNeeded={helpNeed}
                taskId={id}
                setHelpNeeded={setHelpNeed}
                setHelpDescription={setHelpDescription}
              />

              <CustomButton
                onClick={openModal}
                buttonText="Delete Task"
                style={{ paddingTop: 8, paddingBottom: 8, marginTop: 10 }}
              />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  } else {
    return (
      <div className="progressBarContainer">
        <h4>{taskObject.name}</h4>
        <ProgressBar completed={taskObject.progress} />
      </div>
    );
  }
};

export default Task;
