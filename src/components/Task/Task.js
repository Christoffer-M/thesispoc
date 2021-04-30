import { useEffect, useState } from "react";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import * as firebaseDB from "../../database/firebaseDB";
import Modal from "react-modal";
import "./Task.scss";

const Task = (props) => {
  const [helpNeed, setHelpNeed] = useState("");
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
  }, []);
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
        <div className="largeTaskContainer">
          <h3>{props.name}</h3>
          <div className="descriptionDiv">
            <h4>Description: </h4>
            <p>{props.description}</p>
          </div>

          <div className="progressDiv">
            <h4>Progress: </h4>
            <ProgressBar completed={props.progress} />
          </div>

          <div class="helpDiv">
            <h4>Help requested: {helpNeed} </h4>
          </div>
          <button className="deleteButton" onClick={openModal}>
            Delete Task
          </button>
        </div>
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
