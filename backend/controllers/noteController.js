const Note = require("../models/Note");
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newNote = new Note({ 
      title, 
      content, 
      category: category || 'General',
      userId: req.user 
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.user) return res.status(401).json({ message: 'Not authorized' });
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title !== undefined ? req.body.title : note.title, 
        content: req.body.content !== undefined ? req.body.content : note.content,
        isPinned: req.body.isPinned !== undefined ? req.body.isPinned : note.isPinned,
        category: req.body.category !== undefined ? req.body.category : note.category
      },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId.toString() !== req.user)
      return res.status(401).json({ message: "Not authorized" });

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
};
