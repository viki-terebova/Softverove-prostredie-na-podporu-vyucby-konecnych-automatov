import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import HomePage from "./pages/Home";
import AuthenticationPage from "./pages/Authentication";
import CategoriesPage from "./pages/Categories";
import LevelsPage from "./pages/Levels";
import LevelPage from "./pages/Level";
import EditorPage from "./pages/Editor";
import PublicLevelsPage from "./pages/PublicLevels";
import AccountPage from "./pages/Account";
import UserLevelsPage from "./pages/UserLevels";
import LevelEditorPage from "./pages/LevelEditor";

import AuthRequired from "./components/AuthRequired";
import Loading from "./components/Loading";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setCheckingAuth(true);
    fetch("/api/v1/current_user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setCheckingAuth(false); 
      });
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthenticationPage setCurrentUser={setCurrentUser} />} />

        {/* AuthRequired */}
        <Route element={<AuthRequired currentUser={currentUser} checkingAuth={checkingAuth} />}>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<LevelsPage />} />
          <Route path="/level/:levelId" element={<LevelPage />} />
          <Route path="/editor/:levelId" element={<EditorPage />} />
          <Route path="/public_levels" element={<PublicLevelsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/user_levels" element={<UserLevelsPage />} />
          <Route path="/level_editor/:levelId" element={<LevelEditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
