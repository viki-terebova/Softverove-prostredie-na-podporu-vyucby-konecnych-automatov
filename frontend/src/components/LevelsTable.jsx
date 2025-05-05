import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Button from "./Button";

export default function LevelTable({ levels, loading, showEdit = false, onEditClick, showAdd = false, onAddClick }) {
    const navigate = useNavigate();

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Filtering state
    const [filters, setFilters] = useState({
        username: "",
        level_name: "",
        created_at: "",
    });

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const filteredLevels = levels.filter((level) => {
        return (
            (!level.username || level.username.toLowerCase().includes(filters.username.toLowerCase())) &&
            level.level_name.toLowerCase().includes(filters.level_name.toLowerCase()) &&
            level.created_at.includes(filters.created_at)
        );
    });

    const sortedLevels = [...filteredLevels].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="public-levels-table-wrapper">
            {showAdd && (
                <div className="table-header">
                    <Button className="add-button-right" text="+" onClick={onAddClick} />
                </div>
            )}
            {loading ? (
                <Loading message="Loading levels..." />
            ) : (
                <table className="public-levels-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort("level_name")} className="clickable">
                                Level Name {sortConfig.key === "level_name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
                            </th>
                            {levels.length > 0 && levels[0].username !== undefined && (
                                <th onClick={() => requestSort("username")} className="clickable">
                                    User {sortConfig.key === "username" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
                                </th>
                            )}
                            <th onClick={() => requestSort("created_at")} className="clickable">
                                Created At {sortConfig.key === "created_at" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
                            </th>
                            {showEdit && <th>Edit</th>}
                        </tr>
                        <tr>
                            <th>
                                <input
                                    value={filters.level_name}
                                    onChange={(e) => setFilters({ ...filters, level_name: e.target.value })}
                                    placeholder="Filter..."
                                    className="filter-input"
                                />
                            </th>
                            {levels.length > 0 && levels[0].username !== undefined && (
                                <th>
                                    <input
                                        value={filters.username}
                                        onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                        placeholder="Filter..."
                                        className="filter-input"
                                    />
                                </th>
                            )}
                            <th>
                                <input
                                    value={filters.created_at}
                                    onChange={(e) => setFilters({ ...filters, created_at: e.target.value })}
                                    placeholder="Filter..."
                                    className="filter-input"
                                />
                            </th>
                            {showEdit && <th />}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLevels.map((level, index) => (
                            <tr key={index}>
                                <td>{level.level_name}</td>
                                {level.username !== undefined && <td>{level.username}</td>}
                                <td>
                                    {new Date(level.created_at).toLocaleDateString("sk-SK")}{" "}
                                    {new Date(level.created_at).toLocaleTimeString("sk-SK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                {showEdit && (
                                    <td>
                                        <Button text="Edit" onClick={() => onEditClick(level.id)} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
