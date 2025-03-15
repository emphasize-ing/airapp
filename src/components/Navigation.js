import React from "react";
import "./Navigation.css";

const Navigation = ({ onNavigate }) => {
  return (
    <nav className="nav">
      <button onClick={() => onNavigate("home")}>HOME</button>
      <button onClick={() => onNavigate("pdf1")}>PDF1</button>
      <button onClick={() => onNavigate("pdf2")}>PDF2</button>
    </nav>
  );
};

export default Navigation;
