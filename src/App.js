import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";

function App() {
  console.log(useLocation().pathname);
  return (
    <div className="app">
      {useLocation().pathname !== "/" && <Header />}
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/Dashboard" component={Dashboard}></Route>
      </Switch>
    </div>
  );
}

export default App;
