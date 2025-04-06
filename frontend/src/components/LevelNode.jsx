import React from "react";
import "./Node.css";

const LevelNode = ({ level_number, status }) => {
    return (
        <div className={`level-node ${status}`}>
            <span>{level_number}</span>
        </div>
    );
};

export default LevelNode;