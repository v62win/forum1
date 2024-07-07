import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import Vanta.js halo effect
import VANTA from "vanta/dist/vanta.halo.min";

// Rest of your code...

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const visualContentRef = useRef(null);
    const vantaRef = useRef(null);

    const signIN = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/login", {
                email,
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
        console.log({ email, password });
        setEmail("");
        setPassword("");
        await signIN();
    };
    useEffect(() => {
        // Initialize Vanta.js halo effect
        if (!vantaRef.current) {
            vantaRef.current = VANTA({
                el: visualContentRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                backgroundColor: 0x1b1343,
                amplitudeFactor: 3.00,
                xOffset: -0.02,
                size: 0.10
            });
        }

        return () => {
            if (vantaRef.current) {
                vantaRef.current.destroy();
            }
        };
    }, []);
    return (
        <main className="login">
             <div className="visualcontent" ref={visualContentRef}>
                {/* Content for Vanta.js halo effect */}
            </div>
            <div className="login-form-container">
                <h1 className="loginTitle">Log in to your account</h1>
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
                        Don't have an account? <Link to='/register'>Create one</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;
