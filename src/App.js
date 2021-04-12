import * as firebaseDB from "./database/firebaseDB";
import React, { useState, useEffect } from "react";
import "./App.scss";
import Header from "./components/Header";

function App() {
  useEffect(async () => {
    const employees = await firebaseDB.getEmployees();

    console.log(employees);

    employees.forEach((element) => {
      console.log(element.name);
    });
  }, []);

  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
