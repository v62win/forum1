import React, { useState,useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/register", {
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
    console.log({ username,password });
    await signUp();
    setUsername("");
    setPassword("");
  };
  
  const visualContentRef = useRef(null);

useEffect(() => {
    const parallax = (event) => {
        if (visualContentRef.current) {
            visualContentRef.current.querySelectorAll(".bird").forEach((bird) => {
                const speed = parseFloat(bird.getAttribute("data-speed"));
                const x = (event.pageX * speed) / 100;
                const y = (event.pageY * speed) / 100;
                bird.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        }
    };

    document.addEventListener("mousemove", parallax);

    return () => {
        document.removeEventListener("mousemove", parallax);
    };
}, []);

  return (
    <main className="register">
       <div className="visual-content" ref={visualContentRef}>
                <div className="bird bird1" data-speed="2"></div>
                <div className="bird bird2" data-speed="1.5"></div>
                <div className="bird bird3" data-speed="1.8"></div>
                <div className="bird bird4" data-speed="2.2"></div>
                <div className="bird bird5" data-speed="1.3"></div>
                <div className="sun"></div>
                <div className="smiley"></div>
                <div className="bird bird6" data-speed="4"></div>
            </div>
            <div className="register-form-container">
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
      </div>
    </main>
  );
};

export default Register;
