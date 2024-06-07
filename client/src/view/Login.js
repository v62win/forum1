import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const signIN = async () => {
        try {
          const response = await axios.post("http://localhost:4000/api/login", {
            email,
            password,
          });
    
          const data = response.data;
    
          if (response.status === 200) {
            alert(data.message || "Succesfully logged in!");
            navigate('/home');
            localStorage.setItem("_id", data.id);
        
                      
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

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log({ email,password });
        setEmail("");
        setPassword("");
        await signIN();

    };

    return(
        <main className='login'>
            <h1 className="loginTitle">Log in your account</h1>
            <form className="loginForm" onSubmit={handleSubmit}>
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
                <button className="loginBtn">LOG IN</button>
                <p>
                    Don't have a account? <Link to ='/register'>Create one</Link>
                </p>
            </form>
        </main>

    );

    
};
export default Login;