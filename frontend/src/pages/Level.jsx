import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { formatBold } from "../utils/formatText";
import "./../style.css";

const LevelPage = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/level?level_id=${levelId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        setLevel(data);
        setError(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [levelId]);

  const personImage = level?.character_image || "/images/persons/person8.png";
  const automatImage = level?.automat_image || "/images/automats/automat10.png";
  const characterText = level?.task || "⚠️ Could not load level data.";

  return (
    <div className="start-page level-page">
      <Menu />

      <div className="circle-container">
        {loading ? (
          <Loading message="Loading level..." />
        ) : error || !level ? (
          <p className="no-levels-message">⚠️ Could not load level data.</p>
        ) : (
          <>
            <div className="level-box">
              <div className="level-person">
              <h1 className="title2">Level: {level.level_name || level.level_number}</h1>
                <img src={personImage} alt="Character" className="character-image" />
                <div className="character-speech">
                  <p>{formatBold(characterText)}</p>
                </div>
              </div>

              <div className="level-automat">
                <div className="automat-box">
                  <img src={automatImage} alt="Automat" className="automat-image" />
                </div>
              </div>
            </div>

            <div className="repair-button-area">
              <Button text="🛠 Repair" onClick={() => navigate(`/editor/${levelId}`)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LevelPage;
