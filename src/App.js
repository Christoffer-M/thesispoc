import "./App.scss";
import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import YourWork from "./Pages/YourWork/YourWork";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import YourTeam from "./Pages/YourTeam/YourTeam";

function App() {
  const currentPath = useLocation().pathname;

  return (
    <div className="app">
      {currentPath !== "/" ? <Header /> : <></>}
      <Container fluid className="appContainer">
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/Dashboard" component={Dashboard}></Route>
          <Route exact path="/Work" component={YourWork}></Route>
          <Route exact path="/Team" component={YourTeam}></Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
