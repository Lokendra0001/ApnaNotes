const Note = require("../models/note.js");

const handleGetAllNotes = async (req, res) => {
    const notes = await Note.find({ createdBy: req.user.id });
    return res.json(notes);
};

const handleGetEditNote = async (req, res) => {
    const id = req.params.id;
    const notes = await Note.find({ _id: id });
    if (notes) return res.json(notes);
}

const handleAddNote = async (req, res) => {
    const { title, content, category } = req.body;
    const note = await Note.create({ title, content, category, createdBy: req.user.id });
    note ? res.json({ message: "Note Add Successfully!" }) : res.json({ err: "Note not added!" })
}

const handleUpdateEditNote = async (req, res) => {
    const { title, content, category } = req.body;
    const id = req.params.id;
    const note = await Note.findOneAndUpdate({ _id: id }, { title, content, category });
    note ? res.json({ message: "Note Edit Successfully!" }) : res.json({ message: "Note Edit added!" })
};

const handleDeleteNote = async (req, res) => {
    const id = req.body.id;
    const note = await Note.findOneAndDelete({ _id: id });
    note ? res.json({ msg: "Note Deleted Successfully!", id: id }) : res.json("Note not Deleted!")
};

module.exports = {
    handleAddNote,
    handleDeleteNote,
    handleGetAllNotes,
    handleGetEditNote,
    handleUpdateEditNote
}