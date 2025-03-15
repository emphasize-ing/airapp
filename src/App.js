import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./pages/FirstPage";
import SecondPage from "./pages/SecondPage";
import DemoPage from "./pages/DemoPage"; 
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/dive" element={<SecondPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes> {/* ✅ Closing Routes properly */}
    </Router>  
  );
}

export default App;
