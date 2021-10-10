import React,{useState,useContext} from "react";
import { useHistory } from "react-router";
import UserContext from "../context/userContext";

import Button from "../UI/Button";

import styles from "./register.module.css";

const Register = ({ showAlert }) => {

  const history = useHistory();

  if(localStorage.getItem("token")) {
    history.push("/notes");
  }

  const context = useContext(UserContext);
  const {registerUser} = context;

  const [credentials, setCredentials] = useState({username: "",name: "", email: "", password: "", address: "", phone: ""});

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const json = await registerUser(credentials);
    console.log(json);
    if(json.success) {
        localStorage.setItem("token",json.authToken);
        showAlert("Registered Successfully","Success");
        history.push("/");
    }
    else {
        showAlert(json.error,"Failure");
    }

  };
  return (
    <div id={styles.register}>
      <h1>Register Now</h1>
      <form onSubmit={onRegister}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          name="username"
          autoComplete="off"
          value={credentials.username}
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Full Name"
          id="name"
          name="name"
          autoComplete="off"
          value={credentials.name}
          onChange={onChange}
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          id="email"
          name="email"
          autoComplete="off"
          value={credentials.email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Enter Your password"
          name="password"
          id="password"
          value={credentials.password}
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Address"
          name="address"
          id="address"
          value={credentials.address}
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          id="phone"
          value={credentials.phone}
          onChange={onChange}
        />
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default Register;
