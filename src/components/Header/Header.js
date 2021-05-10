import "./Header.scss";
import * as DB from "../../database/firebaseDB";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

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
            <Navbar.Brand>
              <NavLink
                to={headers[0].path}
                className="brand"
                style={{ paddingLeft: 0 }}
              >
                Overview
              </NavLink>
            </Navbar.Brand>
          </Col>
          <Col sm="auto" xs={6}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Col>
        </Row>

        <Row className="d-flex w-100 align-items-center ">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
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
            </Nav>
          </Navbar.Collapse>
        </Row>
      </Container>
      {/* <Container className="d-flex">
        <Row className="navigation align-items-center w-100">
          {headers.map((ref, idx) => {
            return (
              <Col className="navItem align-items-center" xs="auto" key={idx}>
                <NavLink to={ref.path} activeClassName="selected">
                  {ref.name}
                </NavLink>
              </Col>
            );
          })}
          <Col className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img
                  alt="userImage"
                  src={userImage}
                  className="img-fluid img-thumbnail userImage"
                  id="dropdownMenuButton"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {dropDownOptions.map((val, idx) => {
                  if (val.name === "Log Out") {
                    return (
                      <Dropdown.Item
                        onClick={() => {
                          logout();
                        }}
                        key={idx}
                      >
                        Log Out
                        {islogout && <Redirect to={{ pathname: "/" }} />}
                      </Dropdown.Item>
                    );
                  } else {
                    return (
                      <Dropdown.Item key={idx}>
                        <Link to={val.path}>{val.name}</Link>
                      </Dropdown.Item>
                    );
                  }
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container> */}
    </Navbar>
  );
};

export default Header;
