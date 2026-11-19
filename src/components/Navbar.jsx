import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  // mengambil total qty dari context useCart
  const { totalQty } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center gap-4 flex-wrap">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      {/* Menu Navigasi */}
      <div className="flex items-center gap-6">
        {/* Dashboard Links */}
        <Link to="/dashboard" className="hover:text-gray-200">
          Dashboard
        </Link>

        <Link to="/home" className="hover:text-gray-200">
          Home
        </Link>

        <Link to="/cart" className="hover:text-gray-200">
          Keranjang
          {/* tampilkan totalQty jika ada item di keranjang */}
          {totalQty > 0 && (
            <span className="ml-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </Link>

        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded text-sm"
          >
            Admin Panel
          </Link>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-3 text-sm">
            <span>
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-3 py-1 rounded text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}