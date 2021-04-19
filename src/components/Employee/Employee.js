import "./Employee.scss";

const Employee = (props) => {
  return (
    <div className="mainEmployee">
      <h2>{props.name}</h2>
      <p>{props.currentWork}</p>
      <p>{props.advice}</p>
    </div>
  );
};

export default Employee;
