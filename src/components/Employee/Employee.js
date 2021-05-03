import "./Employee.scss";
import ProgressBar from "../Progress-Bar/Progress-Bar";
import { useEffect, useState } from "react";
import MailIcon from "../../assets/icons/MailIcon.png";
import messageIcon from "../../assets/icons/MessageIcon.png";
import phoneIcon from "../../assets/icons/phoneIcon.png";

const Employee = (props) => {
  const [helpNeeded, setHelp] = useState("no");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const emp = {
    name: props.employee.name,
    imageURL: props.employee.imageURL,
    phone: props.employee.phone,
    title: props.employee.title,
    email: props.employee.email,
  };

  let task;
  if (props.task !== null) {
    task = {
      description: props.task.description,
      progress: props.task.progress,
    };
  }

  useEffect(() => {
    if (props.task !== null) {
      if (props.task.helpneeded) {
        setHelp("Yes");
      }
    }

    if (emp.email) {
      setEmail("mailto: " + emp.email);
    }

    if (emp.phone) {
      setPhone("tel: " + emp.phone);
    }
  }, [emp.email, emp.phone]);

  return (
    <div className="mainEmployee">
      <div className="employeeData">
        <div className="employeeHeader">
          <a className="contactLink" href={email}>
            <img src={MailIcon} alt="MailIcon" />
          </a>
          <p className="contactLink">
            <img src={messageIcon} alt="MessageIcon" />
          </p>
          <a className="contactLink" href={phone}>
            <img src={phoneIcon} alt="PhoneIcon" />
          </a>
        </div>
        <div className="employeeMeta">
          <img src={emp.imageURL} alt="ImageUrl" />
          <h2>{emp.name}</h2>
        </div>
        {task !== undefined ? (
          <>
            <div className="currentWork">
              <h3>Currently working on:</h3>
              <p>{task.description}</p>
              <h3>Progress:</h3>
              <ProgressBar completed={task.progress} />
            </div>
            <div className="helpNeeded">
              <h3>Looking for advice</h3>
              <p>{helpNeeded}</p>
            </div>
          </>
        ) : (
          <h3>Currently not assigned to a task</h3>
        )}
      </div>
    </div>
  );
};

export default Employee;
