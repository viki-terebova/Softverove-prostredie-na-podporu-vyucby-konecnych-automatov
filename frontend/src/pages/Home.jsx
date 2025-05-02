import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "../components/Button";
import MenuStart from "../components/MenuStart";

const HomePage = () => {
    const navigate = useNavigate();	
    const handlePlay = () => {
        navigate("/login");
    }

    return (
        <div className="start-page">
            <MenuStart />
            <h1 className="start-welcome-text">Welcome to<br/>FiniAutoma</h1>
            <Button text="Play" onClick={handlePlay} />
        </div>
    );
}

export default HomePage;