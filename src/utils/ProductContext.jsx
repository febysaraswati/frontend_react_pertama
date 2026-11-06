import React, { createContext, useContext } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 
import apiClient from "./apiClient"; 

// Buat konteks 
const ProductContext = createContext(); 

export const ProductProvider = ({ children }) => { 
  const queryClient = useQueryClient(); 
   
  // GET ALL PRODUCTS (Default)
  const { data: products, isLoading, isError } = useQuery({ 
    queryKey: ["products"], 
    queryFn: async () => { 
      const res = await apiClient.get("/products"); 
      return res.data.data; 
    }, 
  }); 

  // GET PRODUCTS DENGAN PARAMETER PAGINATION & FILTER (Sesuai Modul 4.3.4)
  const getProducts = async ({ page = 1, limit = 10, category_id = "", keyword = "" } = {}) => { 
    const res = await apiClient.get(`/products?page=${page}&limit=${limit}&category_id=${category_id}&keyword=${keyword}`); 
    return res.data.data; 
  }; 

  // SHOW CATEGORY DETAIL (Disempurnakan agar aman mendeteksi struktur array data)
  const getCategories = async () => { 
    const res = await apiClient.get("/categories"); 
    // Mengembalikan data apakah itu array langsung, dibungkus dalam .data, atau data.data
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data.data || res.data.categories || []; 
  }; 
  
  // SHOW PRODUCT DETAIL 
  const getProductById = async (id) => { 
    const res = await apiClient.get(`/products/${id}`); 
    return res.data.data; 
  }; 

  // STORE PRODUCT 
  const addProduct = async (formData) => { 
    try { 
      const response = await apiClient.post("/products", formData, { 
        headers: { "Content-Type": "multipart/form-data" }, 
      }); 
      queryClient.invalidateQueries(["products"]); 
      return response; 
    } catch (error) { 
      throw error; 
    } 
  }; 

  // UPDATE PRODUCT 
  const updateProduct = async (id, formData) => { 
    try { 
      const response = await apiClient.post(`/products/${id}?_method=PUT`, formData, { 
        headers: { "Content-Type": "multipart/form-data" }, 
      }); 
      queryClient.invalidateQueries(["products"]); 
      return response; 
    } catch (error) { 
      throw error; 
    } 
  }; 

  // DELETE PRODUCT 
  const deleteProduct = useMutation({ 
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`), 
    onSuccess: () => { 
      queryClient.invalidateQueries(["products"]); 
    }, 
  }); 

  // --- FITUR BARU: STOCK LOGS (MANAJEMEN STOK MASUK / KELUAR) ---

  // GET STOCK LOGS
  const getStockLogs = async () => {
    const res = await apiClient.get("/stock-logs");
    return res.data.data;
  };

  // ADD STOCK LOG
  const addStockLog = async (logData) => {
    try {
      const response = await apiClient.post("/stock-logs", logData);
      queryClient.invalidateQueries(["products"]); // Refresh data produk agar stok terupdate otomatis
      queryClient.invalidateQueries(["stock-logs"]); // Refresh data riwayat stok
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Export PROVIDER 
  return ( 
    <ProductContext.Provider 
      value={{ 
        products, 
        isLoading, 
        isError, 
        getProductById, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        getCategories, 
        getProducts,
        getStockLogs, // <-- Ditambahkan ke context
        addStockLog,  // <-- Ditambahkan ke context
      }} 
    > 
      {children} 
    </ProductContext.Provider> 
  ); 
}; 

export const useProducts = () => useContext(ProductContext);