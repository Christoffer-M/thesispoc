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
  setHelpTextMethod,
  setHelpDescription,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [helpNeed, setHelpNeed] = useState(null);
  const [helpText, setHelpText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const rangeInput = useRef(null);
  const descriptionInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rangeInputValue, setRangeInputValue] = useState(10);

  function afterOpenModal() {
    console.log("Opened");
  }

  function closeModal() {
    setErrorText(null);

    setIsOpen(false);
  }

  function openModal() {
    setRangeInputValue(10);
    setIsOpen(true);
  }
  function getButtonContent() {
    if (modalIsOpen) {
      return (
        <ClipLoader
          size={16}
          color="#ffff"
          css={{
            display: "inline-block",
            alignSelf: "center",
            justifySelf: "center",
          }}
        ></ClipLoader>
      );
    } else {
      return helpText;
    }
  }

  async function uploadHelpRequest() {
    const range = rangeInput.current.value;
    const description = descriptionInput.current.value;
    if (range !== "" && description !== "") {
      setLoading(true);
      await firebaseDB
        .createTaskHelp(taskId, range, description)
        .then(() => {
          setLoading(false);
          firebaseDB.changeHelpRequest(taskId, true);
          setHelpText("Remove Request Help");
          setHelpNeed("Yes");
          setHelpTextMethod("Yes");
          closeModal();
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
      setHelpNeed("Yes");
      setHelpText("Remove help Request");
    } else {
      setHelpNeed("No");
      setHelpText("Request Advice");
    }
  }, [helpNeeded]);

  return (
    <>
      <CustomButton
        color="blue"
        onClick={async () => {
          if (helpNeed === "Yes") {
            firebaseDB.changeHelpRequest(taskId, false);
            setHelpText("Request help");
            setHelpNeed("No");
            setHelpTextMethod("No");
          } else {
            openModal();
          }
        }}
        buttonText={getButtonContent()}
        style={{ paddingTop: 8, paddingBottom: 8 }}
      />
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Task Creation"
        className="helpModalClass"
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
