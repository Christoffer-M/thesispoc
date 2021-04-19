import "./Header.scss";
import * as DB from "../../database/firebaseDB";
import { Link, Redirect } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [islogout, setLogout] = useState(false);

  const headers = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Your Work", path: "/work" },
    { name: "Your Team", path: "/team" },
    { name: "Log Out" },
  ];

  const logout = async () => {
    await DB.logout().then((res) => {
      if (res) {
        setLogout(true);
      }
    });
  };

  return (
    <header className="header">
      <nav>
        <ul className="navigation">
          {headers.map((ref, idx) => {
            if (ref.name === "Log Out") {
              return (
                <li key={idx} onClick={logout}>
                  <a>{ref.name}</a>
                  {islogout && <Redirect to={{ pathname: "/" }} />}
                </li>
              );
            } else {
              return (
                <li key={idx}>
                  <Link to={ref.path}>{ref.name}</Link>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
