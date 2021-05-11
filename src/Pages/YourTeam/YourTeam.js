import "./YourTeam.scss";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import * as firebaseDB from "../../database/firebaseDB";
import Employee from "../../components/Employee/Employee";

const YourTeam = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const employeeArray = await (
        await firebaseDB.getEmployees()
      ).map((res) => {
        return res;
      });
      setEmployees(employeeArray);
    }
    fetchData();
  }, []);

  return (
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
                <Employee id={res.id} employee={res.data} isTeamPage={true} />
              </Col>
            );
          })}
        </Row>
      </Row>
    </Container>
  );
};

export default YourTeam;
