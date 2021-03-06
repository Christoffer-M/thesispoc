import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import addTaskButton from "../../assets/buttons/addButton.svg";
import "./TaskModal.scss";
import closeButton from "../../assets/buttons/closeButton.svg";
import * as firebaseDB from "../../database/firebaseDB";
import Dropdown from "react-dropdown";
import ClipLoader from "react-spinners/ClipLoader";
import { Container, Row, Col } from "react-bootstrap";

const TaskModal = ({ reloadTasks }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [radioHelpNeed, setRadioHelpNeed] = useState(false);
  const rangeInput = useRef(null);
  const helpDescriptionInput = useRef(null);
  const [rangeInputValue, setRangeInputValue] = useState(10);
  const taskAssigned = useRef(null);

  function afterOpenModal() {}

  function closeModal() {
    setErrorText("");
    setLoading(false);
    setIsOpen(false);
    setRadioHelpNeed(false);
  }

  function openModal() {
    setRangeInputValue(10);
    setIsOpen(true);
  }

  useEffect(() => {
    Modal.setAppElement("#root");
    const user = firebaseDB.getUser();
    if (user) {
      taskAssigned.current = user.uid;
      firebaseDB.getEmployees().then((res) => {
        const arr = [];
        const currentUserID = user.uid;
        arr.push({ value: currentUserID, label: "Me" });
        for (const emp of res) {
          arr.push({ value: emp.id, label: emp.data.name });
        }
        setEmployees(arr);
      });
    }

    return () => {
      setEmployees([]);
    };
  }, []);

  async function createTask() {
    setLoading(true);
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;

    let severity = null;
    let helpDescription = null;
    if (radioHelpNeed) {
      severity = rangeInput.current.value;
      helpDescription = helpDescriptionInput.current.value;
    }

    const progress = Math.floor(Math.random() * 101);

    firebaseDB
      .addTask(
        taskName,
        taskDescription,
        taskAssigned.current,
        progress,
        radioHelpNeed,
        severity,
        helpDescription
      )
      .then(async () => {
        closeModal();
        await reloadTasks();
        setLoading(false);
      })
      .catch((err) => {
        setErrorText(err.toString());
        setLoading(false);
      });
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
        <Container>
          <img
            src={closeButton}
            className="closeButton"
            onClick={closeModal}
            alt="closeButton"
          />
          <Row>
            <Col>
              <h2>Create a Task</h2>
              <p>Fill the inputs below to create a task</p>
            </Col>
            <Row>
              <form className="form">
                <label>Task Name *</label>
                <input placeholder="Task Name" id="taskName" />
                <label>Task Description *</label>
                <input placeholder="Task Description" id="taskDescription" />
                <label>Task Assignee *</label>
                <Dropdown
                  onChange={(res) => {
                    taskAssigned.current = res.value;
                  }}
                  options={employees}
                  placeholder="Select an option"
                  className="dropDown"
                  menuClassName="menuClass"
                  value={employees[0]}
                />
                <div className="helpInputs">
                  <label>Would you like help with this task? *</label>
                  <Row className="radioButtons">
                    <Col className="radioButton">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="helpNeeded"
                        id="Yes"
                        onChange={() => {
                          setRadioHelpNeed(true);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Yes
                      </label>
                    </Col>
                    <Col className="radioButton">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="helpNeeded"
                        id="No"
                        defaultChecked
                        onChange={() => {
                          setRadioHelpNeed(false);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        No
                      </label>
                    </Col>
                  </Row>
                </div>
                {radioHelpNeed && (
                  <Row>
                    <Col xs={12} className="d-flex justify-content-center">
                      <label>How difficult would you rate this task?</label>
                    </Col>
                    <Col xs={12} className="d-flex justify-content-center">
                      <label>Very Easy = 0</label>
                      <label>Very Difficult = 10</label>
                    </Col>

                    <Col className="d-flex flex-column align-items-center rangeInputContainer">
                      <input
                        ref={rangeInput}
                        type="range"
                        className="form-range"
                        min="0"
                        max="10"
                        id="customRange2"
                        onChange={(res) => {
                          setRangeInputValue(res.target.value);
                        }}
                      />
                      <h4 className="rangeInputValue">{rangeInputValue}</h4>
                    </Col>

                    <Col
                      xs={12}
                      className="d-flex flex-column align-items-center"
                    >
                      <label>
                        Please describe in a few words, what you need help with
                      </label>
                      <input
                        placeholder="Help Description"
                        className="w-100"
                        ref={helpDescriptionInput}
                      />
                    </Col>
                  </Row>
                )}
                {!loading ? (
                  <div className="submit" onClick={createTask}>
                    Submit
                  </div>
                ) : (
                  <button className="submit">
                    <ClipLoader size={12} color="#fff" />
                  </button>
                )}
                {errorText !== "" && <p className="errorText">{errorText}</p>}
              </form>
            </Row>
          </Row>
        </Container>
      </Modal>
    </>
  );
};

export default TaskModal;
