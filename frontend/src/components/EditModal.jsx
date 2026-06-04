import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
export default function EditModal({
  editingNote,
  setEditingNote,
  handleUpdateNote,
  handleTogglePin,
  handleDelete,
  quillModules,
}) {
  if (!editingNote) return null;
  const onTogglePin = async (e) => {
    e.preventDefault();
    await handleTogglePin(editingNote);
    setEditingNote({ ...editingNote, isPinned: !editingNote.isPinned });
  };
  const onDelete = async (e) => {
    e.preventDefault();
    await handleDelete(editingNote._id);
    setEditingNote(null);
  };
  const isEditingEmpty =
    !editingNote.content ||
    editingNote.content === "<p><br></p>" ||
    editingNote.content.trim() === "";
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60 flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 shrink-0">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Edit Note
          </h3>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onTogglePin}
              className={`h-9 w-9 flex items-center justify-center rounded-full transition-all cursor-pointer ${editingNote.isPinned ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 opacity-100" : "bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-yellow-500"}`}
              title={editingNote.isPinned ? "Unpin Note" : "Pin Note"}
            >
              <span
                className={`text-base ${editingNote.isPinned ? "drop-shadow-sm" : "grayscale opacity-50"}`}
              >
                📌
              </span>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer text-sm"
              title="Delete Note"
            >
              🗑️
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer text-xl"
            >
              ✕
            </button>
          </div>
        </div>
        <form
          onSubmit={handleUpdateNote}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            <div className="px-4 pt-6 pb-2 shrink-0">
              <input
                type="text"
                placeholder="Title"
                className="w-full pb-4 text-2xl font-bold outline-none bg-transparent placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                value={editingNote.title || ""}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, title: e.target.value })
                }
              />
            </div>
            <div className="flex-1 modal-quill">
              <ReactQuill
                theme="snow"
                value={editingNote.content || ""}
                onChange={(content) =>
                  setEditingNote({ ...editingNote, content })
                }
                placeholder="Take a note..."
                modules={quillModules}
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center z-10 shrink-0">
            <select
              value={editingNote.category || "General"}
              onChange={(e) =>
                setEditingNote({ ...editingNote, category: e.target.value })
              }
              className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer font-medium"
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
            </select>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isEditingEmpty}
                className="bg-yellow-400 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-900 hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Update Note
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
