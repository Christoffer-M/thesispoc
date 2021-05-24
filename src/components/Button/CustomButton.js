import { useState } from "react";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import "./CustomButton.scss";

const CustomButton = ({ color, onClick, buttonText, style, loading }) => {
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

  if (loading) {
    return (
      <div
        className={`customButton loading ${
          buttonColor !== null ? buttonColor : ""
        }`}
        style={style}
      >
        <ClipLoader size={20} color="#fff" />
      </div>
    );
  } else {
    return (
      <div
        className={`customButton ${buttonColor !== null ? buttonColor : ""}`}
        onClick={onClick}
        style={style}
      >
        {buttonText}
      </div>
    );
  }
};

export default CustomButton;
