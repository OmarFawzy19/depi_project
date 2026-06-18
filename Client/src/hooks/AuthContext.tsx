import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/lib/errorMessage";

interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  phone?: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredUser = (): AuthUser | null => {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null") as AuthUser | null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  useEffect(() => {
    if (!user) {
      const storedUser = readStoredUser();

      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      return res.data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Login failed");
      console.error("LOGIN ERROR:", message);
      throw message;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
