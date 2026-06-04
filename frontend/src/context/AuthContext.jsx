import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", {
      name,
      email,
      password,
    });
    setUser(res.data.user);
  };
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });
    setUser(res.data.user);
  };
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, updateUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
