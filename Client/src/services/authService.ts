import type { User } from "@/types/User";

const KEY = "makany.user";

export const authService = {
  current(): User | null {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "null");
    } catch {
      return null;
    }
  },
  async login(email: string, _password: string): Promise<User> {
    const user: User = { id: "u1", name: email.split("@")[0], email, role: "buyer" };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  async register(name: string, email: string, _password: string): Promise<User> {
    const user: User = { id: "u1", name, email, role: "buyer" };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem(KEY);
  },
};