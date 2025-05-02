import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LevelNode from "../components/LevelNode";
import './../style.css';
import Menu from "../components/Menu";
import Loading from "../components/Loading";

const LevelsPage = () => {
    const radius = 200;
    const spacing = 120;
    const center = window.innerWidth / 2;

    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState("...");

    const [levels, setLevels] = useState([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/v1/category/${categoryId}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setLevels(data);
                } else {
                    console.error("Backend error:", data.error);
                }
            })
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, [categoryId]);

    useEffect(() => {
        fetch("/api/v1/get_categories")
            .then(res => res.json())
            .then(data => {
                const category = data.find(cat => cat.id === categoryId);
                if (category) {
                    setCategoryName(category.title);
                } else {
                    setCategoryName("Unknown");
                }
            })
            .catch(err => console.error("Category fetch error:", err));
    }, [categoryId]);

    return (
        <div className="start-page levels-page">
            <Menu />
            <h1 className="title">Levels for category:<br/><b>{categoryName}</b></h1>
            <div className="circle-container">
                {loading ? (
                    <Loading message="Loading levels..." />
                ) : levels.length === 0 ? (
                    <p className="no-levels-message">No levels found.</p>
                ) : (
                    levels.map((level, index) => {
                    const angle = (2 * Math.PI * index) / levels.length;
                    const x = center + radius * Math.cos(angle);
                    const y = index * spacing;
                    return (
                        <div
                        key={level.id}
                        className="circle-node-wrapper"
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                        }}
                        onClick={() => navigate(`/level/${level.id}`)}
                        >
                        <LevelNode
                            level_number={level.level_number}
                            status={"passed"}
                        />
                        </div>
                    );
                    })
                    )}
            </div>
        </div>
    );
};

export default LevelsPage;
