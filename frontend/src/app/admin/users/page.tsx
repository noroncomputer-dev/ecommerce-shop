"use client";

import { useEffect, useState } from "react";
import userService, { User } from "../../../services/userService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShieldOff, Trash2, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users :", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await userService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error("Error updatin user role: ", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm("آیا از حذف اطمینان دارید؟")) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user :", error);
      }
    }
    if (loading) {
      return <div className="text-center py-8">درحال بارگذاری...</div>;
    }
  };
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>

      <div className="flex flex-col gap-4 p-2 m-2">
        {users.map((user) => (
          <Card key={user._id} className="">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="">
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {user.role === "admin" ? "ادمین" : "کاربر عادی"}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => toggleAdmin(user._id, user.role)}
                    title={
                      user.role === "admin"
                        ? "برداشتن دسترسی ادمین"
                        : "دادن دسترسی ادمین"
                    }
                  >
                    {user.role === "admin" ? (
                      <ShieldOff className="h-4 w-4 text-red-600" />
                    ) : (
                      <Shield className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
