import React, { useState } from "react";
import * as DB from "./database/firebaseDB";
import { Switch, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";

function App() {
  const currentPath = useLocation().pathname;

  return (
    <div className="app">
      {currentPath !== "/" && <Header />}
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/Dashboard" component={Dashboard}></Route>
      </Switch>
    </div>
  );
}

export default App;
