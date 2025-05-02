import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './../style.css';

function AuthenticationPage({ setCurrentUser }) {
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({ username_or_mail: "", password: "" });
    const [registerData, setRegisterData] = useState({ username: "", mail: "", password: "", password_repeat: "" });
    const navigate = useNavigate();

    const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || "");

    useEffect(() => {
        fetch("/api/v1/session_status", {
            method: "GET",
            credentials: "include",
        })
        .then(res => {
            if (res.ok) {
                navigate("/categories");
            }
        })
        .catch(err => {
            console.error("Session check failed:", err);
        });
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMessage("");
    };

    const handleLogin = async () => {
        setMessage("");
    
        try {
            const res = await fetch("api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include",
            });
    
            const result = await res.json();
    
            if (res.ok) {
                const userRes = await fetch("/api/v1/current_user", {
                    credentials: "include",
                    });
                    const userData = await userRes.json();
                    if (userData.authenticated) {
                        setCurrentUser(userData);
                        setMessage("✅ Login successful! Redirecting...");
                        setTimeout(() => navigate("/categories"), 1000);
                    }
                } else {
                setMessage(result.error || "Unknown error occurred.");
            }
    
        } catch (err) {
            console.error(err);
            setMessage("Cannot reach the server. Please check your connection or try again later.");
        }
    };
    

    const handleRegister = async () => {
        setMessage("");
    
        if (registerData.password !== registerData.password_repeat) {
            setMessage("Passwords do not match. Please retype them.");
            return;
        }
    
        try {
            const res = await fetch("/api/v1/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData)
            });
    
            const result = await res.json();
    
            if (res.ok) {
                const userRes = await fetch("/api/v1/current_user", {
                    credentials: "include",
                    });
                    const userData = await userRes.json();
                    if (userData.authenticated) {
                        setCurrentUser(userData);
                        setMessage("✅ Login successful! Redirecting...");
                        setTimeout(() => navigate("/categories"), 1000);
                    }
                } else {
                setMessage(result.error || "Registration failed. Please try again.");
            }
    
        } catch (err) {
            console.error(err);
            setMessage("Server unreachable. Please try again later.");
        }
    };

    return (
        <div className="start-page">
        {message && (
            <div className="auth-banner">
            {message}
            <button className="auth-banner-close" onClick={() => setMessage("")}>✖</button>
            </div>
        )}

        <div className="floating-form-wrapper">

            <div className="d-flex justify-content-center mb-3">
            <button
                className={`tab-button ${activeTab === "login" ? "active" : ""}`}
                onClick={() => handleTabChange("login")}
            >
                Login
            </button>
            <button
                className={`tab-button ${activeTab === "register" ? "active" : ""}`}
                onClick={() => handleTabChange("register")}
            >
                Register
            </button>
            </div>

            <div className="form-container">
            {activeTab === "login" && (
                <>
                <h2 className="text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Username or mail"
                    className="form-input"
                    value={loginData.username_or_mail}
                    onChange={(e) => setLoginData({ ...loginData, username_or_mail: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <div className="d-flex justify-content-end mb-2">
                    <a href="#">Forgot password?</a>
                </div>
                <button className="form-button" onClick={handleLogin}>Sign In</button>
                </>
            )}

            {activeTab === "register" && (
                <>
                <h2 className="text-center">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
                <input
                    type="mail"
                    placeholder="Mail"
                    className="form-input"
                    value={registerData.mail}
                    onChange={(e) => setRegisterData({ ...registerData, mail: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Repeat Password"
                    className="form-input"
                    value={registerData.password_repeat}
                    onChange={(e) => setRegisterData({ ...registerData, password_repeat: e.target.value })}
                />
                <div className="d-flex justify-content-end mb-2">
                    <label><input type="checkbox" /> I agree to the <a href="/terms">terms</a></label>
                </div>
                <button className="form-button" onClick={handleRegister}>Sign Up</button>
                </>
            )}
            </div>
        </div>
        </div>
    );
}

export default AuthenticationPage;
