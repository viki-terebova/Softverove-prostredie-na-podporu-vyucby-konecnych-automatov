import React from "react";
import Button from "./../components/Button"; 
import "./../style.css";
import { useNavigate } from "react-router-dom";

const LevelPage = () => {
  const navigate = useNavigate();
  const personImage = "/images/persons/person8.png";
  const automatImage = "/images/automats/automat10.png";

  return (
    <div className="start-page level-page">
      <div className="level-box">
        <div className="level-person">
          <img src={personImage} alt="Character" className="character-image" />
          <div className="character-speech">
            <p>
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
              Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! 
            </p>
          </div>
        </div>

        <div className="level-automat">
          <div className="automat-box">
            <img src={automatImage} alt="Automat" className="automat-image" />
          </div>
        </div>
      </div>

      <div className="repair-button-area">
        <Button text="🛠 Repair" onClick={() => navigate("/editor")} />
      </div>
    </div>
  );
};

export default LevelPage;
