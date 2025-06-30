"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Filter } from "lucide-react";
import Loader from "@/components/home/Loader"

// Define the User type
interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

export default function UsersPage() {
  const [tab, setTab] = useState("editor");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "editor" });

  useEffect(() => {
    fetchUsers();
  }, [tab, filter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?role=${tab}&filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Error loading users");
    } finally {
      setLoading(false);
    }
  }

  function openModal(user?: User) {
    setCurrentUser(user || null);
    setFormData(user ? { name: user.name, email: user.email, password: "", role: user.role } : { name: "", email: "", password: "", role: "editor" });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({ name: "", email: "", password: "", role: "editor" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(currentUser ? `/api/users/${currentUser._id}` : "/api/users", {
        method: currentUser ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(currentUser ? "Failed to update user" : "Failed to add user");
      fetchUsers();
      closeModal();
    } catch (err) {
      setError(currentUser ? "Error updating user" : "Error adding user");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError("Error deleting user");
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6">
      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-4">
        <button
          className={`px-3 sm:px-6 py-2 rounded-t-lg font-semibold text-sm sm:text-base border-b-2 transition-all duration-150 ${
            tab === "editor"
              ? "border-[#ff5c35] bg-white text-[#ff5c35] shadow"
              : "border-transparent bg-gray-50 text-gray-500 hover:text-[#ff5c35]"
          }`}
          onClick={() => setTab("editor")}
        >
          Editor
        </button>
        <button
          className={`px-3 sm:px-6 py-2 rounded-t-lg font-semibold text-sm sm:text-base border-b-2 transition-all duration-150 ${
            tab === "admin"
              ? "border-[#ff5c35] bg-white text-[#ff5c35] shadow"
              : "border-transparent bg-gray-50 text-gray-500 hover:text-[#ff5c35]"
          }`}
          onClick={() => setTab("admin")}
        >
          Admin
        </button>
      </div>

      <Card className="rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex gap-2">
            <button onClick={() => openModal()} className="bg-[#ff5c35] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#ff5c35]/90 transition text-sm">Add new</button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <span>Total members: <span className="font-bold text-gray-700">{users.length}</span></span>
              <span>Current used: <span className="font-bold text-gray-700">{users.filter(u => u.status === "active").length}</span></span>
            </div>
            <input
              type="text"
              placeholder="Filter by name or email"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="p-4 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Member name</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Email</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Role</th>
                  <th className="py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Operation</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                    <td className="py-2 px-3 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span>{user.name}</span>
                        <span className="text-gray-500 text-xs sm:hidden">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
                      <span className="truncate block max-w-[200px]">{user.email}</span>
                    </td>
                    <td className="py-2 px-3 sm:px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
                      </span>
                    </td>
                    <td className="py-2 px-3 sm:px-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button 
                          onClick={() => openModal(user)} 
                          className="p-1.5 sm:p-2 rounded hover:bg-[#ff5c35]/10 text-[#ff5c35] transition"
                          aria-label={`Edit user ${user.name}`}
                          title={`Edit user ${user.name}`}
                        >
                          <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="p-1.5 sm:p-2 rounded hover:bg-[#ff5c35]/10 text-[#ff5c35] transition"
                          aria-label={`Delete user ${user.name}`}
                          title={`Delete user ${user.name}`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{currentUser ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:border-transparent"
                  required={!currentUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">User Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c35] focus:border-transparent"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#ff5c35] text-white rounded-lg hover:bg-[#ff5c35]/90">{currentUser ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 