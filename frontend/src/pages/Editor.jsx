// frontend/src/components/EditorScreen.js
import React from "react";
import Button from "./../components/Button"; 
import "./../style.css";
import { useNavigate } from "react-router-dom";

const EditorPage = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="start-page level-page">
      <div className="editor-window">
        <p>🛠 Automat Editor</p>
        <div className="editor-placeholder">
          {/* Automat editor */}
          <p>[ Automat Editing Area ]</p>
        </div>
      </div>
      <div className="repair-button-area">
        <Button text="Test" onClick={() => navigate("/level")} />
      </div>
    </div>
  );
};

export default EditorPage;
