import { useRef, useState } from "react";
import "./AccountCreation.scss";
import { uploadPicture, createNewUser } from "../../database/firebaseDB";
import { BounceLoader } from "react-spinners";
import { Container, Row, Col } from "react-bootstrap";
import ImageTools from "./ImageTools";

const AccountCreation = () => {
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const phoneInput = useRef(null);
  const titleInput = useRef(null);
  const fileInput = useRef(null);
  const passwordInput = useRef(null);
  const [picture, setPictureFilePath] = useState(null);
  const [showErrorText, setShowErrorText] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  let pictureBlob = null;

  function setPicture() {
    //setPictureFilePath(URL.createObjectURL(fileInput.current.files[0]));
    ImageTools.resize(
      fileInput.current.files[0],
      {
        width: 300,
        height: 300,
      },
      function (blob, didItResize) {
        // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
        setPictureFilePath(URL.createObjectURL(blob));
        pictureBlob = blob;
        // you can also now upload this blob using an XHR.
      }
    );
  }

  async function createAccount() {
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const phone = phoneInput.current.value;
    const password = passwordInput.current.value;
    const title = titleInput.current.value;
    if (
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      title !== "" &&
      password !== "" &&
      picture !== null
    ) {
      const fileRef = await uploadPicture(
        pictureBlob,
        pictureBlob.size,
        pictureBlob.type
      );
      const imageURL = await fileRef.getDownloadURL();
      await createNewUser(name, email, phone, password, title, imageURL)
        .then((res) => {
          setErrorText(res);
        })
        .catch(async (err) => {
          await fileRef
            .delete()
            .then(() => {
              console.log("Image successfully deleted");
            })
            .catch((err) => {
              console.error("Could not delete the image", err);
            });
          setShowErrorText(true);
          setErrorText(err);
        });
    } else {
      setErrorText("Please fill out all the fields");
      setShowErrorText(true);
    }
  }

  return (
    <Container className="accountCreation d-flex align-items-center justify-content-center">
      <Row className="d-flex justify-content-center">
        <h3>Please enter the following information</h3>
        <Col md={7}>
          <input placeholder="Full Name" ref={nameInput}></input>
        </Col>
        <Col md={7}>
          <input placeholder="Email" ref={emailInput} type="email"></input>
        </Col>
        <Col md={7}>
          <input
            placeholder="Password"
            ref={passwordInput}
            type="password"
          ></input>
        </Col>
        <Col md={7}>
          <input placeholder="Phone" ref={phoneInput} type="tel"></input>
        </Col>
        <Col md={7}>
          <input placeholder="Title" ref={titleInput}></input>
        </Col>

        <Row xs={12} className="pictureContainer d-flex justify-content-center">
          <Col xs={12}>
            <p>Please upload a profile picture by clicking the button below</p>
          </Col>

          {picture !== null && (
            <Col xs={12}>
              <img src={picture} alt="profile_picture" />
            </Col>
          )}
          {loading && (
            <Col xs={12} className="d-flex justify-content-center">
              <BounceLoader color={"#185a9d"} css="display: block;" />
            </Col>
          )}
          <Col xs={12}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {picture === null ? "Upload Picture" : "Upload new picture"}
            </label>
          </Col>
          <Col xs={12}>
            <p className="supportFormats">Supported Formats: .png/.jpeg</p>
            <input
              id="file-upload"
              type="file"
              ref={fileInput}
              accept="image/png, image/jpeg"
              onChange={setPicture}
              onClick={() => {
                setLoading(true);
              }}
            ></input>
          </Col>
        </Row>
        {showErrorText && <p className="errorText">{errorText}</p>}
        <Col xs={12}>
          <button className="submit" onClick={createAccount}>
            Create Account
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountCreation;
