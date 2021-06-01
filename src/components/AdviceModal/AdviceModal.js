import "./AdviceModal.scss";
import Modal from "react-modal";
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import helpIcon from "../../assets/icons/helpIcon.webp";
import helpGivenIcon from "../../assets/icons/helpReceivedIcon.png";
import closeButton from "../../assets/buttons/closeButton.svg";
import CustomButton from "../Button/CustomButton";
import {
  createAdviceComment,
  hasGivenAdvice,
  getLoggedInUserAdviceComments,
} from "../../database/firebaseDB";
import ProgressBar from "../Progress-Bar/Progress-Bar";

const AdviceModal = ({ large, task, isHelpNeeded, taskID }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpGiven, setHelpGiven] = useState(false);
  const [adviceElements, setadviceElements] = useState([]);
  const adviceInput = useRef(null);

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function createAdvice() {
    setErrorText("");
    const comment = adviceInput.current.value;
    if (comment !== "") {
      setLoading(true);
      await createAdviceComment(taskID, comment)
        .then(async () => {
          setHelpGiven(true);
          await getLoggedInUserAdviceComments(taskID)
            .then((res) => {
              const arr = res.sort((a, b) => {
                var dateA = new Date(a.created.toDate()),
                  dateB = new Date(b.created.toDate());
                return dateA - dateB;
              });
              setadviceElements(arr);
            })
            .catch((err) => {
              console.error(err);
            });
          closeModal();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setErrorText("Please fill out the input with your advice");
    }
  }

  useEffect(() => {
    async function fetchData() {
      await hasGivenAdvice(taskID)
        .then(async (res) => {
          if (res) {
            setHelpGiven(res);
            await getLoggedInUserAdviceComments(taskID)
              .then((res) => {
                const arr = res.sort((a, b) => {
                  var dateA = new Date(a.created.toDate()),
                    dateB = new Date(b.created.toDate());
                  return dateA - dateB;
                });
                setadviceElements(arr);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    fetchData();
    Modal.setAppElement("#root");
  }, [taskID]);

  return (
    <React.Fragment>
      {large ? (
        <Button className="btn btn-warning" onClick={openModal}>
          <img
            src={!helpGiven ? helpIcon : helpGivenIcon}
            className="helpIcon"
            alt="helpIcon"
          />
          Help Needed
        </Button>
      ) : (
        <div className="barContainer" onClick={openModal}>
          {task.helpNeeded && (
            <Col xs={2} className="helpIconContainer">
              <img
                src={!helpGiven ? helpIcon : helpGivenIcon}
                className="helpIcon"
                alt="helpIcon"
              />
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
        className="modalClass"
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
              <h1 style={{ textAlign: "center", marginBottom: 30 }}>
                {task.name}
              </h1>
              <h4>Task Description: </h4>
              <p>{task.description}</p>
              {task.helpNeeded && (
                <>
                  <h4>Issue Description: </h4>
                  <p>{task.helpDescription}</p>
                  <h4>Issue Severity: {task.severity}</h4>
                </>
              )}
            </Col>
            {task.helpNeeded && (
              <>
                <Col xs={12}>
                  <h4>Your advice:</h4>
                  <input placeholder="Your Advice" ref={adviceInput}></input>
                </Col>

                <Col xs={12}>
                  <CustomButton
                    color="blue"
                    buttonText="Submit"
                    loading={loading}
                    onClick={createAdvice}
                  />
                  {errorText !== "" && (
                    <p style={{ color: "red", textAlign: "center" }}>
                      {errorText}
                    </p>
                  )}
                </Col>
                {helpGiven && (
                  <React.Fragment>
                    <h4 className="adviceHeader">Previous advice from you:</h4>
                    <div className="adviceContainer">
                      {adviceElements.map((val, idx) => {
                        if (val) {
                          return (
                            <Col xs={12} key={idx} className="advice">
                              <h6>{val.comment}</h6>
                              <p>
                                {val.created &&
                                  val.created.toDate().toLocaleDateString() +
                                    "-" +
                                    val.created.toDate().toLocaleTimeString()}
                              </p>
                            </Col>
                          );
                        } else return <></>;
                      })}
                    </div>
                    <div></div>
                  </React.Fragment>
                )}
              </>
            )}
          </Row>
        </Container>
      </Modal>
    </React.Fragment>
  );
};

export default AdviceModal;
