import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import EditModal from "../components/EditModal";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Error fetching notes");
      }
    };
    fetchNotes();
  }, []);
  const isNewNoteEmpty =
    !newNote.content ||
    newNote.content === "<p><br></p>" ||
    newNote.content.trim() === "";
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (isNewNoteEmpty) return;
    try {
      const res = await api.post("/notes", newNote);
      if (res.data && res.data._id) {
        setNotes([res.data, ...notes]);
        toast.success("Note added successfully!");
      }
      setNewNote({ title: "", content: "", category: "General" });
    } catch (err) {
      toast.error("Failed to save note.");
    }
  };
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n && n._id !== id));
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Could not delete note.");
    }
  };
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const isEditingEmpty =
      !editingNote.content || editingNote.content === "<p><br></p>";
    if (!editingNote || !editingNote._id || isEditingEmpty) return;
    try {
      const res = await api.put(`/notes/${editingNote._id}`, {
        title: editingNote.title,
        content: editingNote.content,
        category: editingNote.category,
      });
      if (res.data && res.data._id) {
        setNotes(
          notes.map((n) => (n && n._id === editingNote._id ? res.data : n)),
        );
        toast.success("Note updated!");
      }
      setEditingNote(null);
    } catch (err) {
      toast.error("Failed to update note.");
    }
  };
  const handleTogglePin = async (note) => {
    try {
      const res = await api.put(`/notes/${note._id}`, {
        isPinned: !note.isPinned,
      });
      if (res.data) {
        setNotes(notes.map((n) => (n && n._id === note._id ? res.data : n)));
        toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
      }
    } catch (err) {
      toast.error("Failed to pin note");
    }
  };
  const filteredNotes = notes.filter((n) => {
    if (!n) return false;
    const matchesSearch =
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors duration-300 relative">
      <EditModal
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        handleUpdateNote={handleUpdateNote}
        handleTogglePin={handleTogglePin}
        handleDelete={handleDelete}
        quillModules={quillModules}
      />
      <Sidebar
        user={user}
        logout={logout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <header className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
          <div className="relative w-full flex-1">
            <input
              type="text"
              placeholder={`Search ${selectedCategory === "All" ? "all notes" : selectedCategory.toLowerCase() + " notes"}...`}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-yellow-400 outline-none shadow-sm transition-all text-slate-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 opacity-40 text-lg">
              🔍
            </span>
          </div>
        </header>
        <section className="mb-10 md:mb-12 mx-auto">
          <form
            onSubmit={handleAddNote}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
          >
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 pt-5 md:pt-6 pb-2 text-lg md:text-xl font-bold outline-none bg-transparent placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />
            <ReactQuill
              theme="snow"
              value={newNote.content}
              onChange={(content) => setNewNote({ ...newNote, content })}
              placeholder="Take a note..."
              modules={quillModules}
            />
            <div className="px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
              </select>
              <button
                type="submit"
                disabled={isNewNoteEmpty}
                className="bg-yellow-400 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </form>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-start">
          {displayNotes.map((note) => {
            if (!note || !note._id) return null;
            return (
              <div
                key={note._id}
                onClick={() => setEditingNote(note)}
                className={`p-5 md:p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer ${note.isPinned ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600 shadow-yellow-100/50" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
              >
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePin(note);
                    }}
                    className={`h-9 w-9 flex items-center justify-center rounded-full transition-all cursor-pointer z-10 md:opacity-0 group-hover:opacity-100 ${note.isPinned ? "bg-yellow-300 dark:bg-yellow-600 hover:bg-yellow-400 dark:hover:bg-yellow-500 shadow-sm text-yellow-900 dark:text-yellow-50" : "bg-slate-100 dark:bg-slate-700 hover:bg-yellow-100 dark:hover:bg-slate-600 text-slate-400 hover:text-yellow-600"}`}
                    title={note.isPinned ? "Unpin note" : "Pin note"}
                  >
                    <span
                      className={`text-base ${note.isPinned ? "drop-shadow-sm" : "grayscale opacity-50"}`}
                    >
                      📌
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingNote(note);
                    }}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 md:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all cursor-pointer z-10"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note._id);
                    }}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 md:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer z-10 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                {note.title && (
                  <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white pr-28 leading-tight">
                    {note.title}
                  </h3>
                )}
                <div
                  className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-2 line-clamp-6 note-content"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    {new Date(note.createdAt || Date.now()).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                    {note.category || "General"}
                  </span>
                </div>
              </div>
            );
          })}
          {displayNotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <span className="text-5xl md:text-6xl mb-4 block opacity-50">
                📁
              </span>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
                No notes found in {selectedCategory}.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
