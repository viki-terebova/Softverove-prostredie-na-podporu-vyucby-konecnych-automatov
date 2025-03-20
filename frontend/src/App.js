import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

// pages
import HomePage from "./pages/Home";
import AuthentificationPage from "./pages/Authentification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<AuthentificationPage />}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;