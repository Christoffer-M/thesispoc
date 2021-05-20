import "./YourTeam.scss";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Redirect } from "react-router";
import Loading from "../Loading/Loading";
import { getUser, getEmployees } from "../../database/firebaseDB";
import Employee from "../../components/Employee/Employee";
import React from "react";

const YourTeam = () => {
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFound, setUserFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const user = getUser();
      if (user) {
        setEmployees(await getEmployees());
        setUserFound(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (employees === null) {
      fetchData();
    }
  }, [employees]);

  if (loading) {
    return <Loading />;
  } else if (!userFound) {
    return <Redirect to={{ pathname: "/" }} />;
  } else {
    return (
      <React.Fragment>
        <Container>
          <Row className="d-flex align-items-center">
            <Col xs={12} className="h1Header">
              <h1>Your Team</h1>
            </Col>
            <Row>
              {employees.map((res, idx) => {
                return (
                  <Col
                    key={idx}
                    xs={12}
                    sm={6}
                    lg={4}
                    className="d-flex justify-content-center EmployeeContainer"
                  >
                    <Employee
                      id={res.id}
                      employee={res.data}
                      isTeamPage={true}
                    />
                  </Col>
                );
              })}
            </Row>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
};

export default YourTeam;
