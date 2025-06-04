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

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/v1/current_user")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUser(data);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/get_user_levels")
      .then((res) => res.json())
      .then((data) => setLevels(data))
      .catch((err) => console.error("Failed to fetch user levels:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (levelId) => {
    if (!window.confirm("Are you sure you want to delete this level?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/delete_level?level_id=${levelId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const updatedRes = await fetch("/api/v1/get_user_levels");
        const updatedData = await updatedRes.json();
        setLevels(updatedData);
      } else {
        console.error("Failed to delete level");
      }
    } catch (error) {
      console.error("Error deleting level:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-page user-levels-page">
      <Menu />
      <h1 className="public-levels-title">My Levels</h1>
      <div className="create-level-button">
      <Button
        className=""
        text="+"
        onClick={async () => {
          try {
            setLoading(true);
            const response = await fetch("/api/v1/save_level", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                level_name: "Untitled Level",
                task: "Describe the task here...",
                public: false,
                setup: {
                  transition_values: [0.1],
                  accepted_values: [0.1],
                  alphabet_count: {"0.1": 1},
                  type: "NFA"
                }
              }),
            });
            const result = await response.json();
            if (result.level_id) {
              navigate(`/level_editor/${result.level_id}`);
            } else {
              alert("Failed to create level.");
            }
          } catch (error) {
            console.error("Error creating level:", error);
          } finally {
            setLoading(false);
          }
        }}
      />
      </div>
      <LevelsTable 
        levels={levels} 
        loading={loading} 
        showEdit={true} 
        onEditClick={(id) => navigate(`/level_editor/${id}`)}
        onDeleteClick={handleDelete}
        onRowClick={(level) => navigate(`/level/${level.id}`, { state: { from: location.pathname } })}
        userRole={user?.user_role}
      />
    </div>
  );
}
