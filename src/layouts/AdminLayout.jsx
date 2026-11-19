import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menggunakan Komponen Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 border rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="font-bold text-gray-800">My Admin</h1>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-700">
              {user?.name} <strong className="uppercase">({user?.role})</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t p-4 text-center text-sm">
          © 2025 My Admin App — v1.0.0
        </footer>
      </div>
    </div>
  );
}