import { useRef, useState } from "react";
import "./AccountCreation.scss";
import {
  uploadPicture,
  createNewUser,
  normalLogin,
} from "../../database/firebaseDB";
import { BounceLoader } from "react-spinners";
import { Container, Row, Col } from "react-bootstrap";
import ImageTools from "./ImageTools";
import { PhoneValidator } from "phonevalidator";
import CustomButton from "../Button/CustomButton";

const AccountCreation = ({ redirect }) => {
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const pictureBlob = useRef();

  function setPicture() {
    setLoading(true);
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
        pictureBlob.current = blob;
        setLoading(false);
        // you can also now upload this blob using an XHR.
      }
    );
  }

  async function createAccount() {
    setButtonLoading(true);
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    let phone = phoneInput.current.value;
    const password = passwordInput.current.value;
    const title = titleInput.current.value;

    const regex1 = /((\(?45|\+45\)?)?)/;
    // eslint-disable-next-line no-useless-escape
    if (phone.match(regex1)[0] === "") {
      const code = "+45";
      phone = code.concat(phone);
    }
    if (
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      title !== "" &&
      password !== "" &&
      picture !== null
    ) {
      const regex = /^((\(?\+45\)?)?)(\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/;
      if (phone.match(regex)) {
        phone = PhoneValidator.init(phone).val();
        let fileRef;
        if (pictureBlob.current) {
          fileRef = await uploadPicture(
            pictureBlob.current,
            pictureBlob.current.size,
            pictureBlob.current.type
          );
          const imageURL = await fileRef.getDownloadURL();
          await createNewUser(name, email, phone, password, title, imageURL)
            .then(() => {
              console.log("SUCCESS");
              setErrorText("Success! Redirecting...");
              normalLogin(email, password)
                .then(() => {
                  console.log("redirecting.");
                  redirect();
                })
                .catch((err) => {
                  throw err;
                });
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
            })
            .finally(() => {
              setButtonLoading(false);
            });
        } else {
          setErrorText(
            "Picture could not be uploaded, please try another picture"
          );
          setShowErrorText(true);
          setButtonLoading(false);
        }
      } else {
        setErrorText("Phone number is not a valid Danish number");
        setShowErrorText(true);
        setButtonLoading(false);
      }
    } else {
      setErrorText("Please fill out all the fields");
      setShowErrorText(true);
      setButtonLoading(false);
    }
  }

  return (
    <Container className="accountCreation d-flex align-items-center justify-content-center">
      <Row className="d-flex justify-content-center">
        <h3>Please enter the following information</h3>
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
          <input placeholder="Full Name" ref={nameInput}></input>
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
          <Col md={4}>
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
            ></input>
          </Col>
        </Row>
        {showErrorText && <p className="errorText">{errorText}</p>}
        <Col md={4} className="d-flex flex-column">
          <CustomButton
            className="submit"
            buttonText="Create Account"
            onClick={createAccount}
            loading={buttonLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AccountCreation;
