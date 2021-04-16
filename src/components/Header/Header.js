import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
  const headers = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Login", path: "/" },
    { name: "Your Work", path: "/work" },
    { name: "Your Team", path: "/team" },
  ];

  return (
    <header className="header">
      <nav>
        <ul className="navigation">
          {headers.map((ref, idx) => (
            <li key={idx}>
              <Link to={ref.path}>{ref.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
