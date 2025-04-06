import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./style.css";

// pages
import HomePage from "./pages/Home";
import AuthentificationPage from "./pages/Authentification";
import CategoriesPage from "./pages/Categories";
import LevelsPage from "./pages/Levels";
import LevelPage from "./pages/Level";
import EditorPage from "./pages/Editor";

function App() {
  const [screen, setScreen] = useState("level");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<AuthentificationPage />}></Route>
        <Route path="/categories" element={<CategoriesPage />}></Route>
        <Route path="/levels" element={<LevelsPage />}></Route>
        <Route path="/level" element={<LevelPage />}></Route>
        <Route path="/editor" element={<EditorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;