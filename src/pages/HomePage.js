import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [pdfFiles, setPdfFiles] = useState([]);

  // Fetch PDF data from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes/all");
        const data = await response.json();
        setPdfFiles(data); // Set the fetched PDF data
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Download PDFs directly from backend
  const handleDownload = (filename) => {
    const downloadUrl = `http://localhost:5000/api/notes/download/${filename}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename; // Ensure correct filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="homepage">
      {/* Create New Note Button */}
      <button className="btn-create" onClick={() => navigate("/dive")}>
        𝐂𝐫𝐞𝐚𝐭𝐞 𝐍𝐞𝐰 𝐍𝐨𝐭𝐞
      </button>

      {/* Heading */}
      <h1 className="welcome-text">𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐓𝐨 𝐀𝐢𝐫𝐲 𝐖𝐫𝐢𝐭𝐢𝐧𝐠</h1>

      {/* List of PDFs */}
      <div className="pdf-list">
        {pdfFiles.map((pdf) => (
          <div key={pdf._id} className="pdf-item">
            <div className="pdf-content">
              <h3>{pdf.title}</h3>
              <p className="pdf-date">{new Date(pdf.createdAt).toLocaleString()}</p>
              <p>{pdf.description || "No description available."}</p>
            </div>
            <button
              className="btn-download"
              onClick={() => handleDownload(pdf.pdfPath.split("/").pop())}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
