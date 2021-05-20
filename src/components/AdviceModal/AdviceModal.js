import "./AdviceModal.scss";
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import helpIcon from "../../assets/icons/helpIcon.webp";
import closeButton from "../../assets/buttons/closeButton.svg";
import CustomButton from "../Button/CustomButton";
import ProgressBar from "../Progress-Bar/Progress-Bar";

const AdviceModal = ({ large, task, key, isHelpNeeded }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

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

  return (
    <React.Fragment>
      {large ? (
        <Button className="btn btn-warning" onClick={openModal}>
          <img src={helpIcon} className="helpIcon" alt="helpIcon" />
          Help Needed
        </Button>
      ) : (
        <div key={key} className="barContainer" onClick={openModal}>
          {task.helpNeeded && (
            <Col xs={2} className="helpIconContainer">
              <img src={helpIcon} className="helpIcon" alt="helpIcon" />
            </Col>
          )}

          <Col xs={isHelpNeeded(task.helpNeeded)} className="progressBar">
            <h6>{task.name}</h6>
            <ProgressBar completed={task.progress}></ProgressBar>
          </Col>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Give Advice"
        className="adviceModalClass"
        overlayClassName="Overlay"
        onAfterOpen={afterOpenModal}
      >
        <Container className="adviceHelpContainer">
          <img
            src={closeButton}
            className="closeButtonHelpModal"
            onClick={closeModal}
            alt="closeButton"
          />
          <Row className="w-100">
            <Col xs={12}>
              <h1 style={{ textAlign: "center", marginBottom: 30 }}>Task:</h1>
              <h3>Title: {task.name}</h3>
              <h4>Task Description: </h4>
              <p>{task.description}</p>
              {task.helpNeeded && (
                <>
                  <h4>Issue Severity: {task.severity}</h4>
                  <h4>Issue Description: </h4>
                  <p>{task.helpDescription}</p>
                </>
              )}
            </Col>
            {task.helpNeeded && (
              <>
                <Col xs={12}>
                  <h4>Your advice:</h4>
                  <input placeholder="Your Advice"></input>
                </Col>
                <Col xs={12}>
                  <CustomButton color="blue" buttonText="Submit" />
                </Col>
              </>
            )}
          </Row>
        </Container>
      </Modal>
    </React.Fragment>
  );
};

export default AdviceModal;
