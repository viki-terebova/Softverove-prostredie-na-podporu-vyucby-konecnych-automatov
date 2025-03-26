import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import CategoryNode from "../components/CategoryNode";
import './../style.css';


const test_Categories = [
    {category: "levels", 
        status: "passed",
        levels: [
        {level_number: 1, status: "passed"},
        {level_number: 2, status: "passed"},
        {level_number: 3, status: "passed"},
        {level_number: 4, status: false},
    ]},
    {category: "Intermediate", 
    status: "passed",
    levels: [
        {level_number: 1, status: "in_progress"},
        {level_number: 2, status: "in_progress"},
        {level_number: 3, status: "locked" },
        {level_number: 4, status: "locked" },
    ]},
    {category: "Intermediate2", 
    status: "passed",
    levels: [
        {level_number: 1, status: "locked" },
        {level_number: 2, status: "locked" },
        {level_number: 3, status: "locked" },
        {level_number: 4, status: "locked" },
    ]},
    {category: "Intermediate3", 
    status:  "in_progress",
    levels: [
        {level_number: 1, status: "locked" },
        {level_number: 2, status: "locked" },
        {level_number: 3, status: "locked" },
        {level_number: 4, status: "locked" },
    ]},
    {category: "Intermediate4", 
    status: "locked" ,
    levels: [
        {level_number: 1, status: "locked" },
        {level_number: 2, status: "locked" },
        {level_number: 3, status: "locked" },
        {level_number: 4, status: "locked" },
    ]},
    {category: "Intermediate42", 
    status: "locked" ,
    levels: [
        {level_number: 1, status: true},
        {level_number: 2, status: true},
        {level_number: 3, status: false},
        {level_number: 4, status: false},
    ]},
    {category: "Intermediate43", 
    status: "locked" ,
    levels: [
        {level_number: 1, status: true},
        {level_number: 2, status: true},
        {level_number: 3, status: false},
        {level_number: 4, status: false},
    ]},
    {category: "Intermediate44", 
    status: "locked" ,
    levels: [
        {level_number: 1, status: true},
        {level_number: 2, status: true},
        {level_number: 3, status: false},
        {level_number: 4, status: false},
    ]},
];


const CategoriesPage = () => {
    const radius = 300;
    const spacing = 240;
    const center = window.innerWidth / 2;

    const navigate = useNavigate();

    return (
        <div className="start-page categories-page">
            <h1 className="title">Categories</h1>
            <div className="circle-container">
                {test_Categories.map((category, index) => {
                    const angle = (2 * Math.PI * index) / test_Categories.length;
                    const x = center + radius * Math.cos(angle);
                    const y = index * spacing;
                    return (
                        <div
                            key={category.index}
                            className="circle-node-wrapper"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                            }}
                            onClick={() => navigate(`/${category.category}`)}
                        >
                        <CategoryNode
                            key={index}
                            name={index+1+ '. ' + category.category}
                            status={category.status}
                            />
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default CategoriesPage;
