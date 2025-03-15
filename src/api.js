// src/api.js

const BASE_URL = "http://localhost:5000/api/notes";

// Create a new note (PDF)
export const createNote = async (title, text) => {
  try {
    const response = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating note:", error);
  }
};

// Get all notes
export const getAllNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

// Download note
export const downloadNote = (filename) => {
  window.location.href = `${BASE_URL}/download/${filename}`;
};

// Delete note
export const deleteNote = async (id) => {
  try {
    await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};
