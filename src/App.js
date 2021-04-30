import "./App.scss";
import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import YourWork from "./Pages/YourWork/YourWork";

function App() {
  const currentPath = useLocation().pathname;

  return (
    <div className="app">
      {currentPath !== "/" && <Header />}
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <div className="container">
          <Route exact path="/Dashboard" component={Dashboard}></Route>
          <Route exact path="/Work" component={YourWork}></Route>
        </div>
      </Switch>
    </div>
  );
}

export default App;
