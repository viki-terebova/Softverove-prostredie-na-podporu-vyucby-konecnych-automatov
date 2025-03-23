import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../style.css';

function AuthentificationPage() {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLogin = () => {
        console.log("Logging in...");
        navigate("/levels");
    };

    const handleRegister = () => {
        console.log("Registering...");
        navigate("/levels");
    };

    return (
        <div className="container my-5 start-page">
            <div className="d-flex justify-content-center">
                <button
                    className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => handleTabChange("login")}
                >
                    Login
                </button>
                <button
                    className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => handleTabChange("register")}
                >
                    Register
                </button>
            </div>

            {activeTab === "login" && (
                <div className="form-container">
                    <h2 className="text-center">Login</h2>
                    <input type="text" placeholder="Username or Email" className="form-input" />
                    <input type="password" placeholder="Password" className="form-input" />
                    <div className="d-flex justify-content-between">
                        <label><input type="checkbox" /> Remember me </label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button className="form-button" onClick={handleLogin}>Sign In</button>
                </div>
            )}

            {activeTab === "register" && (
                <div className="form-container">
                    <h2 className="text-center">Register</h2>
                    <input type="text" placeholder="Username" className="form-input" />
                    <input type="email" placeholder="Email" className="form-input" />
                    <input type="password" placeholder="Password" className="form-input" />
                    <input type="password_check" placeholder="Repeat Password" className="form-input" />
                    <div className="d-flex justify-content-center">
                        <label><input type="checkbox" /> I agree to the <a href="">terms</a></label>
                    </div>
                    <button className="form-button" onClick={handleRegister}>Sign Up</button>
                </div>
            )}
        </div>
    );
}

export default AuthentificationPage;
