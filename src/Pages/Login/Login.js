import { useState } from "react";
import "./Login.scss";
import * as DB from "../../database/firebaseDB";
import React from "react";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading((currentIsLoaded) => !currentIsLoaded);
    await DB.googleLogin().then((res) => {
      setLoading((currentIsLoaded) => !currentIsLoaded);
      if (res[0].result === "success") {
        console.log("Success");
        console.log("Redirecting...");
      } else {
        console.error(res[0].code);
        console.error(res[0].message);
        setErrorMessage(res[0].code + ": " + res[0].message);
      }
    });
  }

  return (
    <div className="mainLogin">
      <div className="content">
        <h1>Welcome to Overview</h1>
        <p>Please click the link below to log in with your google account</p>
        {!loading && <button onClick={login}>Hi there</button>}

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
