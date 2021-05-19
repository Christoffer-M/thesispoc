import { useEffect, useRef, useState } from "react";
import "./Login.scss";
import firebase from "firebase/app";
import * as DB from "../../database/firebaseDB";
import React from "react";
import BounceLoader from "react-spinners/BounceLoader";
import pic from "../../assets/buttons/btn_google_signin_light_focus_web@2x.png";
import { Redirect } from "react-router";
import AccountCreation from "../../components/AccountCreation/AccountCreation";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loading from "../Loading/Loading";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [errorLoginText, setErrorLoginText] = useState(
    "Please enter both email and password field"
  );
  const [userFound, setUserFound] = useState(false);
  const [showErrorText, setShowErrorText] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        DB.setUser(user);
        setPageLoading(false);
        setUserFound(true);
      } else {
        setPageLoading(false);
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
      const email = emailInput.current.value.trim();
      const password = passwordInput.current.value.trim();
      console.log(password);
      await DB.normalLogin(email, password)
        .then((res) => {
          console.log(res);
          console.log("Success");
          console.log("Redirecting...");
          setRedirect(true);
        })
        .catch((err) => {
          setErrorLoginText(err.message);
          setShowErrorText(true);
          console.error(err.message);
        });
    }
  }
  if (pageLoading) {
    return <Loading />;
  } else if (userFound) {
    return <Redirect to={{ pathname: "/Dashboard" }} />;
  } else {
    return (
      <Container fluid className="mainLogin">
        <Container className="content">
          <h1>Welcome to Overview</h1>
          {!newAccount ? (
            <>
              <Container className="loginForm">
                <Col xs={12}>
                  <input placeholder="E-mail" ref={emailInput}></input>
                </Col>

                <Col xs={12}>
                  <input
                    placeholder="Password"
                    ref={passwordInput}
                    type="password"
                  />
                </Col>
                <Col>
                  {showErrorText && (
                    <p className="errorText">{errorLoginText}</p>
                  )}
                  <button className="loginButton" onClick={normalLogin}>
                    Login
                  </button>
                </Col>
                <Col>
                  <button
                    onClick={() => {
                      setNewAccount(!newAccount);
                    }}
                  >
                    Create new Account
                  </button>
                </Col>
              </Container>
              <Col>
                <p>
                  Click the link below to log in with your google account
                  instead
                </p>
              </Col>

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
              )}
            </>
          ) : (
            <Container>
              <AccountCreation />
              <Row className="goBackText">
                <Col>
                  <p>
                    Already have an account or wish to log in with Google
                    instead?
                  </p>
                  <p
                    onClick={() => {
                      setNewAccount(false);
                    }}
                    className="goBackLink"
                  >
                    Click here to go back
                  </p>
                </Col>
              </Row>
            </Container>
          )}
        </Container>
      </Container>
    );
  }
};

export default Login;
