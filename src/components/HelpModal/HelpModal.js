import "./HelpModal.scss";
import Modal from "react-modal";
import closeButton from "../../assets/buttons/closeButton.svg";
import { ClipLoader } from "react-spinners";
import * as firebaseDB from "../../database/firebaseDB";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../Button/CustomButton";

const HelpModal = ({
  helpNeeded,
  taskId,
  setHelpNeeded,
  setHelpDescription,
  setSeverity,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [helpText, setHelpText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const rangeInput = useRef(null);
  const descriptionInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modalButtonLoading, setmodalButtonLoading] = useState(false);
  const [rangeInputValue, setRangeInputValue] = useState(10);

  function afterOpenModal() {}

  function closeModal() {
    setErrorText(null);
    setmodalButtonLoading(false);
    setIsOpen(false);
  }

  function openModal() {
    setmodalButtonLoading(true);
    setRangeInputValue(10);
    setIsOpen(true);
  }

  async function removeHelpRequest() {
    setmodalButtonLoading(true);
    await firebaseDB
      .changeHelpRequest(taskId, false)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setmodalButtonLoading(false);
        setHelpNeeded(false);
      });
  }

  async function uploadHelpRequest() {
    const range = rangeInput.current.value;
    const description = descriptionInput.current.value;
    if (range !== "" && description !== "") {
      setLoading(true);
      await firebaseDB
        .createTaskHelp(taskId, range, description)
        .then(() => {
          firebaseDB.changeHelpRequest(taskId, true);
          setHelpNeeded(true);
          setHelpDescription(description);
          setSeverity(range);
          closeModal();
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setErrorText(err);
        });
    } else {
      setErrorText("Please fill all the fields");
    }
  }

  useEffect(() => {
    Modal.setAppElement("#root");
    if (helpNeeded) {
      setHelpText("Remove Advice Request");
    } else {
      setHelpText("Request Advice");
    }
  }, [helpNeeded]);

  return (
    <>
      <CustomButton
        color="blue"
        onClick={async () => {
          if (helpNeeded) {
            removeHelpRequest();
          } else {
            openModal();
          }
        }}
        loading={modalButtonLoading}
        buttonText={helpText}
        style={{ paddingTop: 8, paddingBottom: 8 }}
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
          className="closeButtonHelpModal"
          onClick={closeModal}
          alt="closeButton"
        />

        <Container>
          <Row style={{ margin: 10 }}>
            <h1
              style={{ textAlign: "center", marginBottom: 20, fontWeight: 600 }}
            >
              Request Advice
            </h1>
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

            <Col xs={12} className="d-flex flex-column align-items-center">
              <label>
                Please describe in a few words, what you need help with
              </label>
              <input
                placeholder="Help Description"
                className="w-100"
                ref={descriptionInput}
              ></input>
            </Col>
            <Col xs={12} className="d-flex justify-content-center flex-column">
              {!loading ? (
                <CustomButton onClick={uploadHelpRequest} buttonText="Submit" />
              ) : (
                <button className="submit">
                  <ClipLoader size={12} color="#fff" />
                </button>
              )}
              {errorText !== "" && <p className="errorText">{errorText}</p>}
            </Col>
          </Row>
        </Container>
      </Modal>
    </>
  );
};

export default HelpModal;
