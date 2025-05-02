import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Loading from "./Loading";

export default function AuthRequired({ currentUser, checkingAuth }) {
    if (checkingAuth) return <Loading message="Checking authentication..." />;
    return currentUser ? <Outlet /> : <Navigate to="/login" state={{ message: "Please log in to continue." }} />;
}