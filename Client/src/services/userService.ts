import axiosClient from "@/lib/axiosClient";
import type { User } from "@/types/User";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  status: "active" | "deactivated";
  createdAt: string;
}

function normalizeUser(profile: UserProfile): User {
  return {
    id: profile._id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    role: profile.role,
  };
}

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await axiosClient.get<UserProfile>("/user/profile");
    return normalizeUser(data);
  },

  async updateProfile(payload: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<User> {
    const { data } = await axiosClient.put<UserProfile>(
      "/user/profile",
      payload,
    );
    return normalizeUser(data);
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await axiosClient.put("/user/change-password", {
      currentPassword,
      newPassword,
    });
  },

  async deactivateAccount(password: string): Promise<void> {
    await axiosClient.put("/user/deactivate", { password });
  },

  async activateAccount(): Promise<void> {
    await axiosClient.put("/user/activate");
  },

  async deleteAccount(password: string): Promise<void> {
    await axiosClient.delete("/user/delete", { data: { password } });
  },
};
