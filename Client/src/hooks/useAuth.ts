import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import type { User } from "@/types/User";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.current());

  useEffect(() => {
    const sync = () => setUser(authService.current());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return {
    user,
    isAuthed: !!user,
    async login(email: string, password: string) {
      const u = await authService.login(email, password);
      setUser(u);
      return u;
    },
    async register(name: string, email: string, password: string) {
      const u = await authService.register(name, email, password);
      setUser(u);
      return u;
    },
    logout() {
      authService.logout();
      setUser(null);
    },
  };
}