import { useEffect, useRef, useState } from "react";
import "./Login.scss";
import firebase from "firebase/app";
import * as DB from "../../database/firebaseDB";
import React from "react";
import BounceLoader from "react-spinners/BounceLoader";
import pic from "../../assets/buttons/btn_google_signin_light_focus_web@2x.png";
import { Redirect } from "react-router";
import AccountCreation from "../../components/AccountCreation/AccountCreation";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [errorLoginText, setErrorLoginText] = useState(
    "Please enter both email and password field"
  );
  const [showErrorText, setShowErrorText] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setRedirect(true);
      }
    });
  }, []);

  async function googleLogin() {
    setLoading((currentIsLoaded) => !currentIsLoaded);
    await DB.googleLogin().then((res) => {
      if (res === "success") {
        console.log("Success");
        console.log("Redirecting...");
        setRedirect(true);
      } else {
        console.error(res[0].code);
        console.error(res[0].message);
        setErrorMessage(res[0].code + ": " + res[0].message);
      }
      setLoading((currentIsLoaded) => !currentIsLoaded);
    });
  }

  async function normalLogin() {
    if (emailInput.current.value === "" || passwordInput.current.value === "") {
      setShowErrorText(true);
      setErrorLoginText("Please enter both email and password field");
    } else {
      setShowErrorText(false);
    }
    console.log(emailInput.current.value);
    console.log(passwordInput.current);
  }

  return (
    <div className="mainLogin">
      <div className="content">
        <h1>Welcome to Overview</h1>
        {!newAccount ? (
          <>
            {" "}
            <div className="loginForm">
              <input placeholder="E-mail" ref={emailInput}></input>
              <input placeholder="Password" ref={passwordInput}></input>
              {showErrorText && <p className="errorText">{errorLoginText}</p>}
              <button className="loginButton" onClick={normalLogin}>
                Login
              </button>

              <button
                onClick={() => {
                  setNewAccount(!newAccount);
                }}
              >
                Create new Account
              </button>
            </div>
            <p>
              Click the link below to log in with your google account instead
            </p>
            {!loading && (
              <img
                className="googleButton"
                src={pic}
                onClick={googleLogin}
                alt="GoogleButton"
              />
            )}
            {redirect && <Redirect to={{ pathname: "/Dashboard" }} />}
            <BounceLoader color={"#ffffff"} loading={loading} />
            {errorMessage !== "" && (
              <div className="errorText">
                <p>{errorMessage}</p> <p>please try again</p>
              </div>
            )}{" "}
          </>
        ) : (
          <div>
            <AccountCreation />{" "}
            <div className="goBackText">
              <p>
                Already have an account or wish to log in with Google instead?
              </p>
              <p
                onClick={() => {
                  setNewAccount(false);
                }}
                className="goBackLink"
              >
                Click here to go back
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
