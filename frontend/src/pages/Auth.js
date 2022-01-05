import { useRef, useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/auth-context";
import { toast  } from "react-toastify";

import "./Auth.css";

const AuthPage = (props) => {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState({
    type: "",
    desc: "",
  });

  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      email,
      password,
    };
    const endpoint = props.path === "signin" ? "login" : "signup";
    axios
      .post(`http://localhost:8000/user/${endpoint}`, requestBody)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          authContext.login(
            response.data.token,
            response.data.userId,
            response.data.tokenExpiration
          );
          const newMessage = {...message, ...{ type: "success", desc: response.data.message }};
          setMessage(newMessage)
        }
        if (response.data.userId) {
          authContext.signup(response.data.userId);
        }
      })
      .catch((err) => {
        const newMessage = {...message, ...{ type: "error", desc: err.response.data.message }};
        setMessage(newMessage)
      });
  };

  const toastMessage = () => {
    toast(message.desc, {
      type: message.type,
      position: toast.POSITION.TOP_CENTER,
    });
    setMessage({type: "", desc: ""})
  };

  return (
    <>
      { message.desc !== '' &&  toastMessage()}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={emailInput}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordInput}></input>
        </div>
        <div className="form-actions">
          {props.path === "signin" && (
            <button type="submit" className="auth-btn">
              Sign In
            </button>
          )}
          {props.path === "signup" && (
            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AuthPage;
