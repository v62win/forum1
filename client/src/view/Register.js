import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        email,
        password,
        username,
      });

      const data = response.data;

      if (response.status === 201) {
        alert(data.message || "Account created successfully!");
        navigate("/");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, email, password });
    await signUp();
    setEmail("");
    setUsername("");
    setPassword("");
  };

  return (
    <main className="register">
      <h1 className="registerTitle">Create an account</h1>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerBtn">REGISTER</button>
        <p>
          Have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
