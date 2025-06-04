import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './../style.css';

import Menu from "../components/Menu";
import LevelsTable from "../components/LevelsTable"; 

export default function PublicLevelsPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/get_public_levels")
      .then((res) => res.json())
      .then((data) => {
        setLevels(data);
      })
      .catch((err) => console.error("Failed to fetch public levels:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="start-page public-levels-page">
      <Menu />
      <h1 className="public-levels-title">Public Levels</h1>
      <LevelsTable
        levels={levels}
        loading={loading}
        showEdit={false}
        onEditClick={() => {}}
        onDeleteClick={() => {}}
        onRowClick={(level) => navigate(`/level/${level.level_id}`, { state: { from: location.pathname } })}
      />
    </div>
  );
}
