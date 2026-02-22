import api from "./api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    birthDate?: string;
  };
  createdAt: string;
}

// ✅ alias اضافه شد تا import { User } کار کنه
export type User = UserProfile;

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/users/profile");
    return response.data;
  }

  async updateProfile(data: {
    name?: string;
    profile?: {
      phone?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      birthDate?: string;
    };
  }): Promise<UserProfile> {
    const response = await api.put("/users/profile", data);
    return response.data;
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.put("/users/change-password", data);
    return response.data;
  }

  async uploadAvatar(
    file: File,
  ): Promise<{ avatar: string; user: UserProfile }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get("/users");
    return response.data;
  }

  async updateUserRole(
    id: string,
    role: "user" | "admin",
  ): Promise<UserProfile> {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();
