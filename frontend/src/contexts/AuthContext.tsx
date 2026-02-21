"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import authService, {
  User,
  LoginData,
  RegisterData,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void; // ✅ اضافه شد
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const isAdmin = user?.role === "admin";

  const login = async (data: LoginData): Promise<User> => {
    try {
      const userData = await authService.login(data);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const userData = await authService.register(data);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // ✅ آپدیت user در state و localStorage
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    const token = localStorage.getItem("token");
    localStorage.setItem("user", JSON.stringify({ ...updatedUser, token }));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser, // ✅
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
