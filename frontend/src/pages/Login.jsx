import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Check credentials.",
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-slate-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Securely access your QuickNotes
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              placeholder="name@university.edu"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer mt-2"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
          New here?{" "}
          <Link
            to="/signup"
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 font-bold transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
