import { useRef, useState } from "react";
import "./AccountCreation.scss";
import { uploadPicture, createNewUser } from "../../database/firebaseDB";
import axios from "axios";

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

  function setPicture() {
    setPictureFilePath(URL.createObjectURL(fileInput.current.files[0]));
  }

  async function createAccount() {
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const phone = phoneInput.current.value;
    const title = titleInput.current.value;
    const password = titleInput.current.value;
    if (
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      title !== "" &&
      password !== "" &&
      picture !== null
    ) {
      const imageURL = await uploadPicture(picture);
      await createNewUser(name, email, phone, password, title, imageURL)
        .then((res) => {
          console.log("Success");
          console.log(res);
          setErrorText(res);
        })
        .catch((err) => {
          setShowErrorText(true);
          setErrorText(err);
        });
    } else {
      setErrorText("Please fill out all the fields");
      setShowErrorText(true);
    }
  }

  return (
    <div className="accountCreation">
      <h3>Please enter the following information</h3>
      <input placeholder="Full Name" ref={nameInput}></input>
      <input placeholder="Email" ref={emailInput} type="email"></input>
      <input placeholder="Password" ref={passwordInput} type="password"></input>
      <input placeholder="Phone" ref={phoneInput} type="tel"></input>
      <input placeholder="Title" ref={titleInput}></input>
      <div className="pictureContainer">
        <p>Please upload a profile picture by clicking the button below</p>
        {picture !== null && <img src={picture} />}
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload Picture
        </label>
        <p className="supportFormats">Supported Formats: .png/.jpeg</p>
        <input
          id="file-upload"
          type="file"
          ref={fileInput}
          accept="image/png, image/jpeg"
          onChange={setPicture}
        ></input>
      </div>
      {showErrorText && <p className="errorText">{errorText}</p>}
      <button className="submit" onClick={createAccount}>
        Create Account
      </button>
    </div>
  );
};

export default AccountCreation;
