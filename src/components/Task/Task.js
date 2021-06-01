import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import * as firebaseDB from "../../database/firebaseDB";
import Modal from "react-modal";
import "./Task.scss";
import { Container, Row, Col } from "react-bootstrap";
import HelpModal from "../HelpModal/HelpModal";
import AdviceOverviewModal from "../AdviceOverviewModal/AdviceOverviewModal";
import CustomButton from "../Button/CustomButton";
import React from "react";

const Task = ({ id, large, taskObject, reloadTasks }) => {
  const [helpNeed, setHelpNeed] = useState(taskObject.helpNeeded);
  const [helpDescriptionState, setHelpDescription] = useState(
    taskObject.helpDescription
  );
  const [hasAdvice, setHasAdvice] = useState(false);
  const [severity, setSeverity] = useState(taskObject.severity);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteButtonLoading, setdeleteButtonLoading] = useState(false);

  const deleteTask = () => {
    setdeleteButtonLoading(true);
    firebaseDB
      .deleteTask(id)
      .then((res) => {
        console.log(res);
        reloadTasks();
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setdeleteButtonLoading(false);
      });
  };

  function afterOpenModal() {
    setButtonLoading(true);
  }

  function closeModal() {
    setButtonLoading(false);
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    async function fetchData() {
      firebaseDB
        .hasAdvice(id)
        .then((res) => {
          if (res) {
            setHasAdvice(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    fetchData();
    Modal.setAppElement("#root");
  }, [id]);

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
              <CustomButton
                onClick={deleteTask}
                buttonText="Yes, I am sure"
                loading={deleteButtonLoading}
              />
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
              {hasAdvice && helpNeed && <AdviceOverviewModal taskID={id} />}

              <HelpModal
                helpNeeded={helpNeed}
                taskId={id}
                setHelpNeeded={setHelpNeed}
                setHelpDescription={setHelpDescription}
                setSeverity={setSeverity}
              />

              <CustomButton
                loading={buttonLoading}
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
