import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SecondPage.css";

function SecondPage() {
  const navigate = useNavigate();
  const [recognizedText, setRecognizedText] = useState("");
  const [pdfFilename, setPdfFilename] = useState("");

  // Simulate recognized text (replace with actual webcam input later)
  const handleRecognition = () => {
    const sampleText = "Hello, this is recognized text!";
    setRecognizedText(sampleText);
  };

  // Send text to backend to create a PDF
  const createPDF = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Air Writing Note",
          text: recognizedText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("PDF created successfully!");
        setPdfFilename(data.note.pdfPath.split("/").pop()); // Extract filename
      } else {
        alert("Error creating PDF: " + data.error);
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Error while connecting to backend.");
    }
  };

  // Download the generated PDF
  const downloadPDF = () => {
    if (!pdfFilename) return alert("No PDF available to download.");
    const downloadUrl = `http://localhost:5000/api/notes/download/${pdfFilename}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = pdfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="second-page">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="40px"
          height="40px"
        >
          <path d="M14 7l-5 5 5 5V7z" />
        </svg>
      </div>

      <div className="content-container">
        {/* Webcam Container */}
        <div className="webcam-container">
          <div className="webcam-box">
            {/* Webcam feed integration will go here */}
            <button onClick={handleRecognition}>Simulate Recognition</button>
          </div>
        </div>

        {/* PDF Container */}
        <div className="pdf-container">
          <h2>PDF Preview</h2>
          <div className="pdf-box">
            <p>{recognizedText || "Recognized text will appear here."}</p>
          </div>

          <button onClick={createPDF}>Create PDF</button>
          {pdfFilename && (
            <button onClick={downloadPDF}>Download PDF</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecondPage;
