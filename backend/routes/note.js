const express = require("express");
const { handleAddNote, handleDeleteNote, handleGetEditNote, handleUpdateEditNote, handleGetAllNotes } = require("../controllers/note")

const router = express.Router();



router.get('/', handleGetAllNotes)
router.delete("/deleteNote", handleDeleteNote);

router.post('/addnote', handleAddNote)

router.route('/editNote/:id').get(handleGetEditNote).patch(handleUpdateEditNote)


module.exports = router;