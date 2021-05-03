import { useRef, useState } from "react";
import "./AccountCreation.scss";
import { uploadPicture, createNewUser } from "../../database/firebaseDB";
import BounceLoader from "react-spinners/BounceLoader";

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

  function setPicture() {
    setPictureFilePath(URL.createObjectURL(fileInput.current.files[0]));
    setLoading(false);
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
      const fileRef = await uploadPicture(
        fileInput.current.files[0],
        fileInput.current.files[0].size,
        fileInput.current.files[0].type
      );
      const imageURL = await fileRef.getDownloadURL();
      await createNewUser(name, email, phone, password, title, imageURL)
        .then((res) => {
          console.log("Success");
          console.log(res);
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
    <div className="accountCreation">
      <h3>Please enter the following information</h3>
      <input placeholder="Full Name" ref={nameInput}></input>
      <input placeholder="Email" ref={emailInput} type="email"></input>
      <input placeholder="Password" ref={passwordInput} type="password"></input>
      <input placeholder="Phone" ref={phoneInput} type="tel"></input>
      <input placeholder="Title" ref={titleInput}></input>
      <div className="pictureContainer">
        <p>Please upload a profile picture by clicking the button below</p>
        {picture !== null && <img src={picture} alt="profile_picture" />}
        {loading && <BounceLoader color={"#185a9d"} />}
        <label htmlFor="file-upload" className="custom-file-upload">
          {picture === null ? "Upload Picture" : "Upload new picture"}
        </label>
        <p className="supportFormats">Supported Formats: .png/.jpeg</p>
        <input
          id="file-upload"
          type="file"
          ref={fileInput}
          accept="image/png, image/jpeg"
          onChange={setPicture}
          onClick={() => {
            setLoading(true);
            if (picture !== null) {
              setPictureFilePath(null);
            }
          }}
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
