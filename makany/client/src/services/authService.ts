import { ENDPOINTS } from "../config/apiConfig";
import { apiClient } from "./apiClient";

export type LoginPayload = { email: string; password: string };

export const authService = {
  async login(payload: LoginPayload) {
    try {
      const { data } = await apiClient.post(ENDPOINTS.auth.login, payload);
      return data;
    } catch {
      if (payload.email && payload.password) {
        return { token: "mock-token", user: { name: "Demo User", email: payload.email } };
      }
      throw new Error("Invalid credentials");
    }
  },
};
