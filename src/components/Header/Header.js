import "./Header.scss";
import * as DB from "../../database/firebaseDB";
import { NavLink, Redirect, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropDown";
import { isMobile } from "react-device-detect";

const Header = () => {
  const [islogout, setLogout] = useState(false);
  const [userImage, setImage] = useState("");
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
    setTimeout(() => {
      if (DB.getUser() !== null) {
        setImage(DB.getUser().photoURL);
      }
    }, 1000);
  }, []);

  return (
    <Navbar expand="lg" className="header" fixed="top">
      <Container className="navigation d-flex flex-column justify-content-center">
        <Row className="d-flex w-100">
          <Col sm="auto" xs={6}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Col>
        </Row>

        <Row className="d-flex w-100 align-items-center ">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto align-items-center">
              {headers.map((ref, idx) => {
                return (
                  <Col xs="auto">
                    <Nav.Link key={idx}>
                      <NavLink to={ref.path} activeClassName="selected">
                        {ref.name}
                      </NavLink>
                    </Nav.Link>
                  </Col>
                );
              })}
              {!isMobile ? (
                <Col xs="auto">
                  <NavDropdown
                    id="basic-nav-dropdown"
                    title={
                      <img
                        alt="userImage"
                        src={userImage}
                        className="img-fluid img-thumbnail userImage"
                        id="dropdownMenuButton"
                      />
                    }
                  >
                    {dropDownOptions.map((val, idx) => {
                      if (val.name === "Log Out") {
                        return (
                          <NavDropdown.Item
                            onClick={() => {
                              logout();
                            }}
                            key={idx}
                          >
                            Log Out
                            {islogout && <Redirect to={{ pathname: "/" }} />}
                          </NavDropdown.Item>
                        );
                      } else {
                        return (
                          <NavDropdown.Item key={idx}>
                            <Link to={val.path}>{val.name}</Link>
                          </NavDropdown.Item>
                        );
                      }
                    })}
                  </NavDropdown>
                </Col>
              ) : (
                <Col xs="auto">
                  {dropDownOptions.map((val, idx) => {
                    if (val.name === "Log Out") {
                      return (
                        <Nav.Link
                          onClick={() => {
                            logout();
                          }}
                          key={idx}
                          className="mobileLink"
                        >
                          Log Out
                          {islogout && <Redirect to={{ pathname: "/" }} />}
                        </Nav.Link>
                      );
                    } else {
                      return (
                        <Col xs="auto">
                          <Nav.Link key={idx}>
                            <NavLink
                              to={val.path}
                              activeClassName="selected"
                              className="mobileLink"
                            >
                              {val.name}
                            </NavLink>
                          </Nav.Link>
                        </Col>
                      );
                    }
                  })}
                </Col>
              )}
            </Nav>
          </Navbar.Collapse>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
