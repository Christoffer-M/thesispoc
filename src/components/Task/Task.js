import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import * as firebaseDB from "../../database/firebaseDB";
import Modal from "react-modal";
import "./Task.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HelpModal from "../HelpModal/HelpModal";
import CustomButton from "../Button/CustomButton";

const Task = (props) => {
  const [helpNeed, setHelpNeed] = useState("");
  const [, setHelpDescription] = useState(props.helpDescription);
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
    } else {
      setHelpNeed("No");
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
          <Row className="modalButtons">
            <Col xs={6}>
              <CustomButton
                onClick={deleteTask}
                buttonText="Yes, I am sure"
              ></CustomButton>
            </Col>
            <Col>
              <CustomButton
                color="blue"
                onClick={closeModal}
                buttonText="No, take me back"
              ></CustomButton>
            </Col>
          </Row>
        </Modal>
        <Container className="d-flex flex-column justify-content-between largeTaskContainer ">
          <Row className="h-100">
            <Col xs={12}>
              <h3>{props.name}</h3>
            </Col>

            <Col xs={12}>
              <h4>Description: </h4>
              <p>{props.description}</p>

              <Col className="progressRow" xs={12}>
                <h4>Progress: </h4>
                <ProgressBar completed={props.progress} />
              </Col>

              <h4>Help requested: {helpNeed} </h4>
            </Col>

            <Col xs={12} className="d-flex justify-content-end flex-column">
              <HelpModal
                helpNeeded={props.helpNeed}
                taskId={props.id}
                setHelpTextMethod={setHelpNeed}
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
