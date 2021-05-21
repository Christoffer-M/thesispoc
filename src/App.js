import "./App.scss";
import React from "react";
import { setUser } from "./database/firebaseDB";
import Login from "./Pages/Login/Login";
import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";

import Dashboard from "./Pages/Dashboard/Dashboard";
import YourWork from "./Pages/YourWork/YourWork";
import YourTeam from "./Pages/YourTeam/YourTeam";
import Header from "./components/Header/Header";
import Loading from "./Pages/Loading/Loading";

function App() {
  const [loading, setLoading] = useState(true);
  const currentPath = useLocation().pathname;

  const validPaths = ["/Dashboard", "/Work", "/Team"];

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="app">
        {validPaths.includes(currentPath) ? <Header /> : <></>}
        <Container fluid className="appContainer">
          <Switch>
            <Route exact path="/Dashboard" component={Dashboard}></Route>
            <Route exact path="/Work" component={YourWork}></Route>
            <Route exact path="/Team" component={YourTeam}></Route>
            <Route exact path="/" component={Login}></Route>
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
