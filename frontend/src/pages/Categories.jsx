import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import CategoryNode from "../components/CategoryNode";
import './../style.css';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const radius = 300;
    const spacing = 240;
    const center = window.innerWidth / 2;

    const navigate = useNavigate();


    useEffect(() => {
        fetch("api/v1/get_categories")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setCategories(data);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    return (
        <div className="start-page categories-page">
            <h1 className="title">Categories</h1>
            <div className="circle-container">
                {categories.map((category, index) => {
                    const angle = (2 * Math.PI * index) / categories.length;
                    const x = center + radius * Math.cos(angle);
                    const y = index * spacing;
                    return (
                        <div
                            key={category.id}
                            className="circle-node-wrapper"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                            }}
                            onClick={() => navigate(`/${category.id}`)}
                        >
                            <CategoryNode
                                key={index}
                                name={`${index + 1}. ${category.title}`}
                                status={"passed"}
                            />
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default CategoriesPage;
