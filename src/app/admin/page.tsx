"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { getAllUsers, updateUserRole } from "@/lib/utils";
import { User, UserRole } from "@/types";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setUpdating(userId);
    try {
      await updateUserRole(userId, newRole);
      await loadUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-lg text-gray-600">Manage users and their roles</p>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Users ({users.length})
              </h3>

              {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <div className="space-y-4">
                  {users.map((userItem) => (
                    <div
                      key={userItem.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {userItem.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {userItem.email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                userItem.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : userItem.role === "user"
                                  ? "bg-green-100 text-green-800"
                                  : userItem.role === "cherry"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {userItem.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              Joined: {userItem.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {userItem.id !== user.id && (
                          <div className="flex space-x-2">
                            {userItem.role === "guest" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="bordered"
                                  onClick={() =>
                                    handleRoleUpdate(userItem.id, "cherry")
                                  }
                                  isLoading={updating === userItem.id}
                                >
                                  Approve as Cherry
                                </Button>
                                <Button
                                  size="sm"
                                  color="primary"
                                  onClick={() =>
                                    handleRoleUpdate(userItem.id, "user")
                                  }
                                  isLoading={updating === userItem.id}
                                >
                                  Approve as User
                                </Button>
                              </>
                            )}
                            {userItem.role === "cherry" && (
                              <Button
                                size="sm"
                                color="primary"
                                onClick={() =>
                                  handleRoleUpdate(userItem.id, "user")
                                }
                                isLoading={updating === userItem.id}
                              >
                                Promote to User
                              </Button>
                            )}
                            {userItem.role !== "admin" && (
                              <Button
                                size="sm"
                                color="secondary"
                                onClick={() =>
                                  handleRoleUpdate(userItem.id, "admin")
                                }
                                isLoading={updating === userItem.id}
                              >
                                Make Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
