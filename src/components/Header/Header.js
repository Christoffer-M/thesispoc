import "./Header.scss";
import * as DB from "../../database/firebaseDB";
import { Redirect, NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [islogout, setLogout] = useState(false);
  const [userImage, setImage] = useState("");
  const [showDropDown, setDropDown] = useState(false);

  const headers = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Your Work", path: "/Work" },
    { name: "Your Team", path: "/team" },
  ];

  const dropDownOptions = [{ name: "Log Out" }];

  const logout = async () => {
    await DB.logout().then((res) => {
      if (res) {
        setLogout(true);
      }
    });
  };

  useEffect(() => {
    console.log("Looping");
    setTimeout(() => {
      if (DB.getUser() !== null) {
        console.log("Setting USER!");
        setImage(DB.getUser().photoURL);
      } else {
        console.log("Trying agian in 1 second");
      }
    }, 1000);
  }, []);

  return (
    <header className="header">
      <nav>
        <ul className="navigation">
          {headers.map((ref, idx) => {
            return (
              <li key={idx}>
                <NavLink to={ref.path} activeClassName="selected">
                  {ref.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <img
          src={userImage}
          class="userImage"
          onClick={() => {
            console.log("setting drop down");
            setDropDown(!showDropDown);
            console.log(showDropDown);
          }}
        ></img>
      </nav>
      {showDropDown && (
        <div class="userOptions_Container">
          <ul>
            {dropDownOptions.map((val, idx) => {
              if (val.name === "Log Out") {
                console.log("HI THERE");
                return (
                  <li key={idx} onClick={logout}>
                    <a>{val.name}</a>
                    {islogout && <Redirect to={{ pathname: "/" }} />}
                  </li>
                );
              } else {
                return (
                  <li key={idx}>
                    <Link to={val.path}>{val.name}</Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
