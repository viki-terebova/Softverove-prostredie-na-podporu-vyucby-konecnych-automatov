import React, { useState, useEffect } from "react";
import './../style.css';

import Menu from "../components/Menu";
import Loading from "../components/Loading";

export default function PublicLevelsPage() {
  const [levels, setLevels] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({ username: "", level_name: "", created_at: "", });
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/public_levels")
      .then((res) => res.json())
      .then((data) => {
        setLevels(data);
      })
      .catch((err) => console.error("Failed to fetch levels:", err))
      .finally(() => setLoading(false));
  }, []);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredLevels = levels.filter((level) => {
    return (
      level.username.toLowerCase().includes(filters.username.toLowerCase()) &&
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
    <div className="start-page public-levels-page">
      <Menu />
      <h1 className="public-levels-title">Public Levels</h1>
        <div className="public-levels-table-wrapper">
        {loading ? (
          <Loading message="Loading public levels..." />
        ) : (
          <table className="public-levels-table">
            <thead>
              <tr>
              <th onClick={() => requestSort("level_name")} className="clickable">
                Level Name {sortConfig.key === "level_name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th onClick={() => requestSort("username")} className="clickable">
                User {sortConfig.key === "username" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              <th onClick={() => requestSort("created_at")} className="clickable">
                Created At {sortConfig.key === "created_at" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▲▼"}
              </th>
              </tr>
              <tr>
                <th><input value={filters.level_name} onChange={(e) => setFilters({ ...filters, level_name: e.target.value })} placeholder="Filter..." className="filter-input" /></th>
                <th><input value={filters.username} onChange={(e) => setFilters({ ...filters, username: e.target.value })} placeholder="Filter..." className="filter-input" /></th>
                <th><input value={filters.created_at} onChange={(e) => setFilters({ ...filters, created_at: e.target.value })} placeholder="Filter..." className="filter-input" /></th>
              </tr>
            </thead>
            <tbody>
              {sortedLevels.map((level, index) => (
                <tr key={index}>
                  <td>{level.level_name}</td>
                  <td>{level.username}</td>
                  <td>
                  {new Date(level.created_at).toLocaleDateString("sk-SK")}{" - "}
                  {new Date(level.created_at).toLocaleTimeString("sk-SK", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
