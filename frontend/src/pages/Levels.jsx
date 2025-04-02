import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import LevelNode from "../components/LevelNode";
import './../style.css';


const test_Levels = [
    {category: "levels", 
        status: "passed",
        levels: [
        {level_number: 1, status: "passed"},
        {level_number: 2, status: "passed"},
        {level_number: 3, status: "passed"},
        {level_number: 4, status: "in_progress"},
        {level_number: 5, status: "locked"},
        {level_number: 11, status: "locked"},  
        {level_number: 4, status: "locked"},
        {level_number: 5, status: "locked"},
        {level_number: 11, status: "locked"}, 
        {level_number: 4, status: "locked"},
        {level_number: 5, status: "locked"},
        {level_number: 11, status: "locked"},   
    ]},
];


const LevelsPage = () => {
    const radius = 200;
    const spacing = 120;
    const center = window.innerWidth / 2;

    const [selectedCategory, setSelectedCategory] = useState(test_Levels[0]);
    const navigate = useNavigate();

    return (
        <div className="start-page levels-page">
            <h1 className="title">{selectedCategory.category}</h1>
            <div className="circle-container">
                {selectedCategory.levels.map((level, index) => {
                    const angle = (2 * Math.PI * index) / selectedCategory.levels.length;
                    const x = center + radius * Math.cos(angle);
                    const y = index * spacing;
                    return (
                        <div
                            key={index}
                            className="circle-node-wrapper"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                            }}
                            onClick={() => navigate(`/level/${level.level_number}`)}
                        >
                        <LevelNode
                            key={index}
                            level_number={level.level_number}
                            status={level.status}
                            />
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default LevelsPage;
