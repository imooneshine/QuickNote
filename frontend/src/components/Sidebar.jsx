import { Link } from "react-router";
export default function Sidebar({
  user,
  logout,
  isDarkMode,
  toggleDarkMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  selectedCategory,
  setSelectedCategory,
}) {
  const categories = ["All", "General", "Work", "Personal", "Study"];
  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col transform transition-transform duration-300 ease-in-out 
          md:relative md:translate-x-0 md:flex md:w-64
          ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-8 shrink-0">
          <h2 className="text-2xl font-bold text-yellow-500 tracking-tight">
            QuickNote<span className="text-slate-900 dark:text-white">Pro</span>
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          <nav className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-3 mt-2">
              Categories
            </p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 font-medium w-full p-3 rounded-xl transition-all cursor-pointer 
                  ${
                    selectedCategory === cat
                      ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
              >
                <span className="text-lg">{cat === "All" ? "📝" : "📁"}</span>
                <span>{cat}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="shrink-0 pt-6 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
          >
            <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <div className="flex items-center space-x-3 px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 uppercase shrink-0">
              {user?.name?.[0] || "U"}
            </div>
            <span className="font-medium truncate text-slate-900 dark:text-slate-100 text-sm">
              {user?.name}
            </span>
          </div>
          <Link
            to="/settings"
            className="flex items-center space-x-3 w-full p-3 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="text-lg">⚙️</span> <span>Settings</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
          >
            <span className="text-lg">🚪</span> <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
