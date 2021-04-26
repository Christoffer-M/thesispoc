import { useEffect, useState } from "react";
import Modal from "react-modal";
import addTaskButton from "../../assets/buttons/addButton.svg";
import "./TaskModal.scss";
import closeButton from "../../assets/buttons/closeButton.svg";
import * as firebaseDB from "../../database/firebaseDB";
import Dropdown from "react-dropdown";
import ClipLoader from "react-spinners/ClipLoader";

const TaskModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

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

    firebaseDB.getEmployees().then((res) => {
      const arr = [];
      arr.push("Me");
      for (const emp of res) {
        arr.push(emp.data.name);
      }
      setEmployees(arr);
    });
  }, []);

  function createTask() {
    setLoading(true);
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskAssigned = document.getElementById;
    console.log(taskName);
    setLoading(false);
  }

  return (
    <>
      <img
        className="addTaskButton"
        src={addTaskButton}
        onClick={openModal}
        alt="taskbutton"
      />
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Task Creation"
        className="modalClass"
        overlayClassName="Overlay"
        onAfterOpen={afterOpenModal}
      >
        <img
          src={closeButton}
          className="closeButton"
          onClick={closeModal}
          alt="closeButton"
        />
        <h2>Create a Task</h2>
        <p>Fill the inputs below to create a task</p>
        <form className="form">
          <label>Task Name *</label>
          <input placeholder="Task Name" id="taskName" />
          <label>Task Description *</label>
          <input placeholder="Task Description" id="taskDescription" />
          <label>Task Assignee *</label>
          <Dropdown
            options={employees}
            placeholder="Select an option"
            className="dropDown"
            menuClassName="menuClass"
            value={employees[0]}
          />
          <div className="helpInputs">
            <label>Would you like help with this task? *</label>
            <div className="radioButtons">
              <div className="radioButton">
                <input type="radio" name="helpNeeded" value="Yes" /> Yes
              </div>
              <div className="radioButton">
                <input type="radio" name="helpNeeded" value="No" /> No
              </div>
            </div>
          </div>
          {!loading ? (
            <div className="submit" onClick={createTask}>
              Submit
            </div>
          ) : (
            <button className="submit">
              <ClipLoader size={12} color="#fff" />
            </button>
          )}
        </form>
      </Modal>
    </>
  );
};

export default TaskModal;
