import React from "react";
import "./Node.css";

const CategoryNode = ({ name, status }) => {
  return (
    <div className={`category-node ${status}`}>
      <span>{name}</span>
    </div>
  );
};

export default CategoryNode;