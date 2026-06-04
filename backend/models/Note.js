const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  content: {
    type: String,
    required: [true, "Note content cannot be empty"],
    trim: true,
  },
  isPinned: { type: Boolean, default: false },
  category: { type: String, default: "General" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Note", noteSchema);