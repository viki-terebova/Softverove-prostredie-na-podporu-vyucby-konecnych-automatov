import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Menu from "../components/Menu";

export default function AccountPage() {
    const [userData, setUserData] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/current_user", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    setUserData(data);
                    setNewUsername(data.username);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleProfileUpdate = async () => {
        try {
            const res = await fetch("/api/v1/update_account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: newUsername }),
            });
            const result = await res.json();
            setMessage(result.message || result.error);
        } catch (err) {
            setMessage("Failed to update profile.");
        }
    };

    const handlePasswordChange = async () => {
        try {
            const res = await fetch("/api/v1/change_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const result = await res.json();
            setMessage(result.message || result.error);
        } catch (err) {
            setMessage("Failed to change password.");
        }
    };

    if (loading) return <Loading message="Loading account..." />;

    if (!userData) return <p className="form-message">User not found.</p>;

    return (
        <div className="start-page">
            {message && (
            <div className="auth-banner">
                {message}
                <button className="auth-banner-close" onClick={() => setMessage("")}>✖</button>
            </div>
            )}
            <Menu />
            <h1 className="title2">Account Settings</h1>
            <div className="form-container">
                <div className="form-group d-flex align-items-center">
                    <label className="form-label mb-0 me-3" style={{ minWidth: "100px" }}>
                        Mail: 
                    </label>
                    <label><i>{userData.mail}</i></label>
                </div>
                <div className="form-group d-flex align-items-center">
                    <label className="form-label mb-0 me-3" style={{ minWidth: "100px" }}>
                        Username:
                    </label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="form-input flex-grow-1"
                    />
                    </div>
                <button onClick={handleProfileUpdate} className="form-button">Update Username</button>

                <hr />
                <label><b>Password</b></label>
                <div className="form-group d-flex align-items-center">
                    <label className="form-label mb-0 me-3" style={{ minWidth: "100px" }}>
                        Old:
                    </label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="form-input flex-grow-1"
                    />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label mb-0 me-3" style={{ minWidth: "100px" }}>
                        New:
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input flex-grow-1"
                    />
                </div>
                <button onClick={handlePasswordChange} className="form-button">Change Password</button>
                
            </div>
        </div>
    );
}
