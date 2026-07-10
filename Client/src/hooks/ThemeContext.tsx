import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function userThemeKey(userId: string) {
  return `theme_${userId}`;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [theme, setTheme] = useState<Theme>(() => {
    if (user) {
      const saved = localStorage.getItem(userThemeKey(user.id)) as Theme | null;
      return saved === "dark" ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(userThemeKey(user.id)) as Theme | null;
      setTheme(saved === "dark" ? "dark" : "light");
    } else {
      setTheme("light");
    }
  }, [user]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      if (user) {
        localStorage.setItem(userThemeKey(user.id), next);
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
