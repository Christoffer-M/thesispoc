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
  const [helpDescriptionState, setHelpDescription] = useState(
    taskObject.helpDescription
  );
  const [severity, setSeverity] = useState(taskObject.severity);
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
  }, []);

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
              <h2>{taskObject.name}</h2>
            </Col>

            <Col xs={12}>
              <p style={{ marginTop: 10 }}>{taskObject.description}</p>

              <Col className="progressRow" xs={12}>
                <h5>Progress: </h5>
                <ProgressBar completed={taskObject.progress} />
              </Col>
              {helpNeed && (
                <Col xs="auto">
                  <h5>Advice requested </h5>
                  <div className="adviceTextContainer">
                    <p>{helpDescriptionState}</p>

                    <h6 className="adviceText">Difficulty: {severity}</h6>
                  </div>
                </Col>
              )}
            </Col>

            <Col xs={12} className="d-flex flex-column justify-content-end">
              <HelpModal
                helpNeeded={helpNeed}
                taskId={id}
                setHelpNeeded={setHelpNeed}
                setHelpDescription={setHelpDescription}
                setSeverity={setSeverity}
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
