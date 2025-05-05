import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import CategoryNode from "../components/CategoryNode";
import Menu from "../components/Menu";
import Loading from "../components/Loading";
import './../style.css';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const radius = 300;
    const spacing = 240;
    const center = window.innerWidth / 2;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        fetch("/api/v1/get_categories")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setCategories(data);
                }
            })
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="start-page categories-page">
            <Menu />
            <h1 className="title">Categories</h1>
                <div className="circle-container">
                {loading ? (
                    <Loading message="Loading levels..." />
                ) : (
                    categories.map((category, index) => {
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
                                
                                onClick={() => {if (category.status !== "locked") {
                                    navigate(`/category/${category.id}`)};
                                }}
                            >
                                <CategoryNode
                                    key={index}
                                    name={`${index + 1}. ${category.title}`}
                                    status={category.status}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
