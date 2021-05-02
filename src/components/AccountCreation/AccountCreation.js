import { useRef, useState } from "react";
import "./AccountCreation.scss";
import { createNewUser, uploadPicture } from "../../database/firebaseDB";

const AccountCreation = () => {
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const phoneInput = useRef(null);
  const titleInput = useRef(null);
  const fileInput = useRef(null);
  const passwordInput = useRef(null);
  const [picture, setPictureFilePath] = useState(null);
  const [showErrorText, setShowErrorText] = useState(false);

  function setPicture() {
    setPictureFilePath(URL.createObjectURL(fileInput.current.files[0]));
  }

  async function createAccount() {
    if (
      nameInput.current.value !== "" &&
      emailInput.current.value !== "" &&
      phoneInput.current.value !== "" &&
      titleInput.current.value !== "" &&
      passwordInput.current.value !== "" &&
      picture !== null
    ) {
      setShowErrorText(false);
      await createNewUser(
        nameInput.current.value,
        emailInput.current.value,
        passwordInput.current.value,
        phoneInput.current.value,
        titleInput.current.value,
        picture
      );
    } else {
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
      {showErrorText && (
        <p className="errorText">Please fill out all the fields</p>
      )}
      <button className="submit" onClick={createAccount}>
        Create Account
      </button>
    </div>
  );
};

export default AccountCreation;
