import { useEffect, useState } from "react";
import "./Login.scss";
import firebase from "firebase/app";
import * as DB from "../../database/firebaseDB";
import React from "react";
import BounceLoader from "react-spinners/BounceLoader";
import pic from "../../assets/buttons/btn_google_signin_light_focus_web@2x.png";
import { Redirect } from "react-router";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        DB.setUser(user);
        setRedirect(true);
      }
    });
  }, []);

  async function login() {
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

  return (
    <div className="mainLogin">
      <div className="content">
        <h1>Welcome to Overview</h1>
        <p>Please click the link below to log in with your google account</p>
        {!loading && (
          <img
            className="googleButton"
            src={pic}
            onClick={login}
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
      </div>
    </div>
  );
};

export default Login;
