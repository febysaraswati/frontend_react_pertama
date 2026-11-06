import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { Toaster } from "react-hot-toast";

import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { ProductProvider } from './utils/ProductContext.jsx'; // Pastikan diimpor dengan benar sesuai letak filenya

const queryClient = new QueryClient(); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* ProductProvider harus membungkus komponen di bawahnya */}
        <ProductProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
        </ProductProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);