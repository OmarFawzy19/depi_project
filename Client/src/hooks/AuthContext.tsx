import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

import { authService } from "@/services/authService";
import type { User } from "@/types/User";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Always synchronize with localStorage whenever the provider mounts
  useEffect(() => {
    setUser(authService.current());
  }, []);

  useEffect(() => {
    const syncUser = () => {
      setUser(authService.current());
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("google-login", syncUser);
    window.addEventListener("focus", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("google-login", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<User> => {
    const newUser = await authService.register(
      name,
      email,
      phone,
      password
    );

    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = {
        ...prev,
        ...updates,
      };

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};