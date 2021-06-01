import React from "react";
import { useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import Modal from "react-modal";
import closeButton from "../../assets/buttons/closeButton.svg";
import CustomButton from "../Button/CustomButton";

const AdviceOverviewModal = ({ task }) => {
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
      <CustomButton buttonText="See Advice" onClick={openModal} />

      <Modal
        isOpen={modalIsOpen}
        contentLabel="Advice Overview"
        className="modalClass"
        overlayClassName="Overlay"
        onAfterOpen={afterOpenModal}
      >
        <Container>
          <Row>
            <img
              src={closeButton}
              className="closeButton"
              onClick={closeModal}
              alt="closeButton"
            />
          </Row>
        </Container>
      </Modal>
    </React.Fragment>
  );
};

export default AdviceOverviewModal;
