import React from "react";
import Button from "./components/Button";
import "./style.css";

function App() {
  const handlePlay = () => {
    console.log("Playing");
  }

  return (
    <div className="start-page">
      <h1 className="start-welcome-text">Welcome to<br/>FiniAutoma</h1>
      <Button text="Play" onClick={handlePlay} />
    </div>
  );
}

export default App;