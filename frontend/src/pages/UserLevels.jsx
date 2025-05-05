import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './../style.css';

import Menu from "../components/Menu";
import Button from "./../components/Button"; 
import LevelsTable from "../components/LevelsTable";

export default function UserLevelsPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/get_user_levels")
      .then((res) => res.json())
      .then((data) => setLevels(data))
      .catch((err) => console.error("Failed to fetch user levels:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="start-page user-levels-page">
      <Menu />
      <h1 className="public-levels-title">My Levels</h1>
      <div className="create-level-button">
        <Button className="" text="+" onClick={() => navigate("/create_level")} />
      </div>
      <LevelsTable 
        levels={levels} 
        loading={loading} 
        showEdit={true} 
        onEditClick={(id) => navigate(`/level_editor/${id}`)}
      />
    </div>
  );
}
