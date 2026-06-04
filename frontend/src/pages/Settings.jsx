import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import toast from "react-hot-toast";
export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", profileData);
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      await api.put("/users/password", passwordData);
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };
  const handleDeleteAccount = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    const loadingToast = toast.loading("Deleting account...");
    try {
      await api.delete("/users/account");
      toast.dismiss(loadingToast);
      await logout();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Failed to delete account");
      setIsConfirmingDelete(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors duration-300 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <Link
            to="/"
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
          >
            ⬅️
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Account Settings
          </h1>
        </div>
        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-8 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
          <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>
          <section className="bg-red-50 dark:bg-red-950/20 rounded-3xl shadow-sm border border-red-200 dark:border-red-900/50 p-6 md:p-8 mt-12">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">
              Danger Zone
            </h2>
            <p className="text-red-800/80 dark:text-red-400/80 text-sm mb-6">
              Once you delete your account, there is no going back. Please be
              certain. All of your notes and data will be permanently erased.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className={`text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer ${
                  isConfirmingDelete
                    ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-500/30"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isConfirmingDelete
                  ? "Are you sure? Click to confirm"
                  : "Delete Account"}
              </button>
              {isConfirmingDelete && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer px-3 py-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
