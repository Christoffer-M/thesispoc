import { useState } from "react";
import { useEffect } from "react";
import "./CustomButton.scss";

const CustomButton = ({ color, onClick, buttonText, style }) => {
  const [buttonColor, setbuttonColor] = useState(null);

  useEffect(() => {
    switch (color) {
      case "blue":
        setbuttonColor("blue");
        break;
      case "yellow":
        setbuttonColor("yellow");
        break;
      default:
        break;
    }
  }, [color]);
  return (
    <div
      className={`customButton ${buttonColor !== null ? buttonColor : ""}`}
      onClick={onClick}
      style={style}
    >
      {buttonText}
    </div>
  );
};

export default CustomButton;
