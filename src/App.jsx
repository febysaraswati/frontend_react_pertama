import { Routes, Route } from "react-router-dom"; 
import AdminDashboard from "./pages/adminpages/AdminDashboard"; 
import AdminLayout from "./layouts/AdminLayout"; 
import AboutPage from "./pages/adminpages/AboutPage"; 
import MainLayout from "./layouts/MainLayout"; 
import Dashboard from "./pages/frontpages/Dashboard"; 
import ProductDetail from "./pages/frontpages/ProductDetail"; 
import Cart from "./pages/frontpages/Cart"; 
import Checkout from "./pages/frontpages/Checkout"; 
import ProductForm from "./pages/adminpages/ProductForm"; 
import ProductEdit from "./pages/adminpages/ProductEdit"; 
import StockLogPage from "./pages/adminpages/StockLogPage"; 

export default function App() { 
  return ( 
    <Routes> 
      <Route path="/" element={<MainLayout />}> 
        <Route index element={<Dashboard />} /> 
        <Route path="product/:id" element={<ProductDetail />} /> 
        <Route path="cart" element={<Cart />} /> 
        <Route path="checkout" element={<Checkout />} /> 
      </Route> 

      {/* Admin Layout wrapper */} 
      <Route path="/admin" element={<AdminLayout />}> 
            <Route path="dashboard" element={<AdminDashboard />} /> 
            <Route path="about" element={<AboutPage />} /> 
            <Route path="add-product" element={<ProductForm />} /> 
            <Route path="edit-product/:id" element={<ProductEdit />} /> 
            <Route path="stock-logs" element={<StockLogPage />} /> {/* <-- 2. Daftarkan rute Stock Logs */} 
      </Route> 
    </Routes> 
  ); 
}