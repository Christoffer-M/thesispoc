import react from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="navigation">
        <h3>Dashboard</h3>
        <h3>Your Work</h3>
        <h3>Your Team</h3>
      </div>
    </header>
  );
};

export default Header;
