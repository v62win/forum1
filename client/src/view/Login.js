import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signIN = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/login", {
                username,
                password,
            });

            const data = response.data;

            if (response.status === 200) {
                alert(data.message || "Successfully logged in!");
                navigate('/home');
                localStorage.setItem("_id", data.id);
                localStorage.setItem("_name", data.you);
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
        console.log({ username, password });
        setUsername("");
        setPassword("");
        await signIN();
    };

    const visualContentRef = useRef(null);

    useEffect(() => {
        const parallax = (event) => {
            if (visualContentRef.current) {
                visualContentRef.current.querySelectorAll(".bird").forEach((bird) => {
                    const speed = parseFloat(bird.getAttribute("data-speed"));
                    const x = (window.innerWidth - event.pageX * speed) / 100;
                    const y = (window.innerHeight - event.pageY * speed) / 100;
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
        <main className="login">
            <div className="visual-content" ref={visualContentRef}>
                <div className="bird bird1" data-speed="2"></div>
                <div className="bird bird2" data-speed="1.5"></div>
                <div className="bird bird3" data-speed="1.8"></div>
                <div className="bird bird4" data-speed="2.2"></div>
                <div className="bird bird5" data-speed="1.3"></div>
                <div className="sun"></div>
                <div className="smiley"></div>
                <div className="bird bird6" data-speed="1"></div>
                
            </div>
            <div className="login-form-container">
                <h1 className="loginTitle">Log in to your account</h1>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
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
                    <button className="loginBtn">LOG IN</button>
                    <p>
                        Don't have an account? <Link to='/register'>Create one</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;
