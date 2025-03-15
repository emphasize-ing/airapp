import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="first-page">
      {/* Demo Button at Top Right */}
      <button className="btn-demo" onClick={() => navigate("/demo")}>
        DEMO
      </button>

      <div className="content">
        <div className="text-container">
          <p>WE ARE HERE TO EASE YOUR WORK</p>
          <h1>
            YOUR HAND IS THE PEN, <br /> THE AIR IS YOUR CANVAS
          </h1>
        </div>
        <div className="logo-container">
          <div className="logo"></div>
        </div>
      </div>

      <div className="button-container">
        <button className="btn-dive" onClick={() => navigate("/dive")}>
          <span>DIVE INTO WRITING</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="20px"
            height="20px"
          >
            <path d="M10 17l5-5-5-5v10z" />
          </svg>
        </button>

        <button className="btn-home" onClick={() => navigate("/home")}>
          HOME
        </button>
      </div>
    </div>
  );
}

export default FirstPage;
