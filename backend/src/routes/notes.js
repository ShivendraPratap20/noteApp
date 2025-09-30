const express = require("express");
const router = express.Router();
const {addNote, getNote, deleteNote} = require("../controller/notesCtrl");

router.get("/:id", getNote);
router.post("/", addNote);
router.delete("/", deleteNote);

module.exports = router;