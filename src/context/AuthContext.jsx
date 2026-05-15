import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../api/endpoints";

const AuthContext = createContext();

const readStored = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStored);

  const login = ({ user: userData, token }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // logout is best-effort; proceed with client cleanup regardless
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
  };

  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isVendor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
