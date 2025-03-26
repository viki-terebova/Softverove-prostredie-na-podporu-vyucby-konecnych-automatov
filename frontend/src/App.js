import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

// pages
import HomePage from "./pages/Home";
import AuthentificationPage from "./pages/Authentification";
import CategoriesPage from "./pages/Categories";
import LevelsPage from "./pages/Levels";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<AuthentificationPage />}></Route>
        <Route path="/categories" element={<CategoriesPage />}></Route>
        <Route path="/levels" element={<LevelsPage />}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;