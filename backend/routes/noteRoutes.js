const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

// Routes

router.post("/create", noteController.createNote);
router.get("/all", noteController.getNotes);
router.get("/download/:filename", noteController.downloadNote);
router.delete("/delete/:id", noteController.deleteNote);

module.exports = router;
