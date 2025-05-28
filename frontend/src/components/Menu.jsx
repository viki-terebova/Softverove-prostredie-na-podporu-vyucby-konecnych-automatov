import {React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Dropdown, Container } from "react-bootstrap";
import "./Menu.css";
import Loading from "./Loading";

export default function Menu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/get_user_score")
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.score !== undefined) {
          setScore(data.score);
        }
      })
      .catch(err => console.error("Failed to load score:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Navbar fixed="top" bg="dark" variant="dark" className="fini-navbar">
      {loading && (
          <Loading message="Loading Menu..." />
      )}
      <Container fluid className="d-flex gap-1 justify-content-between align-items-center">
        {/* <img src="/images/logo.png" alt="Logo" className="navbar-logo" /> */}
        <div className="d-flex gap-1">
        <Dropdown align="start">
          <Dropdown.Toggle variant="dark" size="sm" className="navbar-icon-button">
            ☰
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as="button" onClick={() => navigate("/")}>🏠 Home</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => navigate("/categories")}>🎮 Categories</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as="button" onClick={() => navigate("/public_levels")}>🌐 Public Levels</Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item as="button" onClick={() => navigate(`/user_levels`)}>🖌️ My Levels</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => navigate("/account")}>👤 Account</Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={async () => {
                setLoading(true);
                const res = await fetch("/api/v1/logout", {
                  method: "GET",
                  credentials: "include",
                });

                if (res.ok) {
                  navigate("/login", { state: { message: "You were logged out successfully." } });
                } else {
                  alert("Logout failed.");
                }
                setLoading(false);
              }}
            >
              ➡️ Log out
            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item as="button" onClick={() => navigate("/about")}>ℹ️ About</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown align="start">
          <Dropdown.Toggle size="sm" variant="dark" className="navbar-icon-button">
          🇬🇧
          {/* ToDo: make the flag specific to chosen language */}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as="button">🇬🇧 English</Dropdown.Item>
            <Dropdown.Item as="button">🇸🇰 Slovak</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
          <button variant="outline-light" size="sm" onClick={() => navigate(-1)} className="navbar-icon-button">
          ↶
          </button>
        </div>
        <div className="navbar-score">
          <span>⭐ {score}</span>
        </div>
      </Container>
    </Navbar>
  );
}
