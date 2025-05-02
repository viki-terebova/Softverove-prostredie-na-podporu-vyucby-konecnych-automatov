import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Dropdown, Container } from "react-bootstrap";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const userId = 123;

  return (
    <Navbar fixed="top" bg="dark" variant="dark" className="fini-navbar">
      <Container fluid className="d-flex gap-1 justify-content-start">
        <Dropdown align="start">
          <Dropdown.Toggle variant="dark" size="sm" className="navbar-icon-button">
            ☰
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as="button" onClick={() => navigate("/")}>🏠 Home</Dropdown.Item>

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
        </Container>
    </Navbar>
  );
}
