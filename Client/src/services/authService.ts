import axiosClient from "@/lib/axiosClient";
import type { User } from "@/types/User";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const authService = {
  current(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? "null");
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<User> {
    const res = await axiosClient.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

    return res.data.user;
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<User> {
    const res = await axiosClient.post("/auth/register", {
      name,
      email,
      phone,
      password,
      role: "user",
    });

    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

    return res.data.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await axiosClient.post("/auth/forgot-password", {
      email,
    });
  },

  async verifyOtp(email: string, otp: string): Promise<void> {
    await axiosClient.post("/auth/verify-otp", {
      email,
      otp,
    });
  },

  async resetPassword(
    email: string,
    password: string
  ): Promise<void> {
    await axiosClient.post("/auth/reset-password", {
      email,
      password,
    });
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};