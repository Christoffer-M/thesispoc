import "./AdviceOverviewModal.scss";
import React from "react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getTaskAdviceComments } from "../../database/firebaseDB";
import Modal from "react-modal";
import closeButton from "../../assets/buttons/closeButton.svg";
import CustomButton from "../Button/CustomButton";
import ClipLoader from "react-spinners/ClipLoader";

const AdviceOverviewModal = ({ taskID }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [adviceElements, setAdvice] = useState([]);
  const [loading, setLoading] = useState(false);

  async function afterOpenModal() {
    console.log("Getting comments");
    await getTaskAdviceComments(taskID)
      .then((res) => {
        if (res.length > 1) {
          const arr = res.sort((a, b) => {
            var dateA = new Date(a.created.toDate()),
              dateB = new Date(b.created.toDate());
            return dateA - dateB;
          });
          setAdvice(arr);
          setLoading(true);
        } else {
          setAdvice(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
      <CustomButton
        buttonText="See Advice"
        onClick={openModal}
        color="blue"
        style={{ paddingTop: 8, paddingBottom: 8, marginTop: 10 }}
      />

      <Modal
        isOpen={modalIsOpen}
        contentLabel="Advice Overview"
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

          <Row className="adviceContainer">
            <h4 className="text-center">Advice from colleagues</h4>
            {loading ? (
              adviceElements.map((val, idx) => {
                if (val) {
                  return (
                    <Col xs={12} key={idx} className="advice">
                      <div
                        className="d-flex align-items-center"
                        style={{ marginBottom: 10 }}
                      >
                        <h5 style={{ marginBottom: 0, paddingRight: 10 }}>
                          {val.userName}
                        </h5>
                        <p style={{ marginBottom: 0 }}>
                          {val.created &&
                            val.created.toDate().toLocaleDateString() +
                              "-" +
                              val.created.toDate().toLocaleTimeString()}
                        </p>
                      </div>

                      <p>{val.comment}</p>
                    </Col>
                  );
                } else return <></>;
              })
            ) : (
              <Col className="d-flex justify-content-center">
                <ClipLoader color="#fff" />
              </Col>
            )}
          </Row>
        </Container>
      </Modal>
    </React.Fragment>
  );
};

export default AdviceOverviewModal;
