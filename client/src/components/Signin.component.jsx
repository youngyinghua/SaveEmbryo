import React, { useState } from "react";
import logo from "../assets/embryo-logo.png";
import "./Signin.style.css";
import axios from "axios";

const Signin = ({ login }) => {
  const [signin, setSignin] = useState({ username: "", password: "" });
  const handleChange = (e) => {
    const { value, name } = e.target;
    setSignin((preState) => ({ ...preState, [name]: value }));
  };

  const handleSubmitSignin = (e) => {
    e.preventDefault();
    return axios
      .post("https://embcryo-api.herokuapp.com/signin", { username, password })
      .then((response) => {
        if (response.data.login === "success") {
          login(username, response.data.token);
        } else {
          window.alert("login failed");
        }
        //redirect to home page
      })
      .catch((err) => {
        console.log(err);
        window.alert("login failed");
      });
  };

  const { username, password } = signin;
  return (
    <div className="signin">
      <div className="signin-logo">
        <div className="signin-letters">EmbCry</div>
        <img src={logo} alt="embryo" className="signin-image" />
      </div>
      <hr></hr>
      <div className="signin-content">
        <form onSubmit={handleSubmitSignin}>
          <label htmlFor="username">username:</label>
          <input
            name="username"
            value={username}
            type="text"
            required
            onChange={handleChange}
            autoFocus
          />
          <br></br>
          <br></br>
          <label htmlFor="password">password:</label>
          <input
            name="password"
            value={password}
            type="password"
            autoComplete="username"
            required
            onChange={handleChange}
          />
          <div>
            <button className="submit-button signin-button">ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signin;
