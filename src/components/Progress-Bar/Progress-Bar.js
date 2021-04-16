import React from "react";
import "./Progress-bar.scss";

const ProgressBar = (props) => {
  const completed = props.completed;

  function getColor(value) {
    return ["hsl(", value, ",100%,50%)"].join("");
  }

  const containerStyles = {
    height: 30,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: getColor(completed),
    borderRadius: "inherit",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span className="labelStyles">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
