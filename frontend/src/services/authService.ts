import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string; // ✅ optional شد تا با UserProfile سازگار باشه
}

class AuthService {
  async login(data: LoginData): Promise<User> {
    const response = await api.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await api.post("/auth/register", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export default new AuthService();