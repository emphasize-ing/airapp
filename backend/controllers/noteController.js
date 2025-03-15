const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Note = require("../models/Note");

// Create PDF and save to MongoDB
exports.createNote = async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text || !title) return res.status(400).json({ error: "Text and title are required" });

    // Create PDF
    const doc = new PDFDocument();
    const pdfPath = `uploads/${title.replace(/\s+/g, "_")}.pdf`;
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.text(text, 100, 100);
    doc.end();

    // Save to database
    const note = new Note({ title, pdfPath });
    await note.save();

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download PDF
exports.downloadNote = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);
  res.download(filePath);
};

// Delete PDF
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Delete from filesystem
    fs.unlinkSync(note.pdfPath);

    // Remove from MongoDB
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
