import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Loading.css"; 

export default function Loading({ message = "Loading..." }) {
    return (
        <div className="auth-check-spinner">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">{message}</span>
            </div>
        </div>
    );
}