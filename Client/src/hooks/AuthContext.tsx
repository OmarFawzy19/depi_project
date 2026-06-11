import { createContext, useContext, useState } from "react";
import axiosClient from "@/lib/axiosClient";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return res.data; // ✅ IMPORTANT
    } catch (err: any) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      // 🔥 THIS WILL SHOW REAL ERROR
      throw err.response?.data?.error || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);