// import { Link } from "react-router-dom"; 
import { products } from "../../utils/data";
import ProductCard from "../../components/ProductCart";
 
export default function Dashboard() { 
  return ( 
    <div> 
      <h1 className="text-2xl font-bold mb-4">Dashboard Produk</h1> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
        {products.map((item) => (
          // p adalah props untuk mengirim data produk ke komponen ProductCard
          // Tambahkan key={item.id} agar warning hilang
          <ProductCard key={item.id} p={item} />
        ))}
      </div> 
    </div> 
  ); 
}