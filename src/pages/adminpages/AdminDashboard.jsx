import React, { useState } from "react"; 
import { Link } from "react-router-dom"; 
import { useQuery } from "@tanstack/react-query"; 
import { useProducts } from "../../utils/ProductContext"; 
import toast from "react-hot-toast"; 
 
//nama komponen 
export default function AdminDashboard() { 
  // State untuk parameter pagination dan filter
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Ambil fungsi getProducts, getCategories, dan deleteProduct dari context 
  const { getProducts, getCategories, deleteProduct } = useProducts(); 

  // Fetch data kategori untuk dropdown filter
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch data produk dinamis berdasarkan page, limit, category_id, dan keyword (Sesuai Modul 4.3.4)
  const { data: products = [], isLoading, isError, refetch } = useQuery({ 
    queryKey: ["products", page, categoryId, searchQuery], 
    queryFn: () => getProducts({ page, limit: 5, category_id: categoryId, keyword: searchQuery }), 
    keepPreviousData: true,
  }); 

  if (isLoading) return <p className="p-4">Loading...</p>; 
  if (isError) return <p className="p-4 text-red-500">Error loading products.</p>; 

  const handleDelete = async (id) => { 
    const confirmDelete = window.confirm( 
      "Apakah kamu yakin ingin menghapus produk ini?" 
    ); 
    if (!confirmDelete) return; 
 
    try { 
      await deleteProduct.mutateAsync(id); 
      toast.success("Produk berhasil dihapus!");
      refetch();
    } catch (error) { 
      toast.error("Terjadi kesalahan saat menghapus produk."); 
    } 
  }; 

  // Handle ketika tombol cari ditekan
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(keyword);
    setPage(1); // Reset ke halaman pertama saat melakukan pencarian baru
  }; 
 
  return ( 
    <div className="p-4 bg-white rounded shadow space-y-4"> 
      <h1 className="text-xl font-bold mb-4">Manajemen Produk</h1> 

      {/* SEARCH & FILTER PANEL (Sesuai Modul 4.3.4) */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2 items-center justify-between bg-gray-50 p-3 rounded-lg border">
        <div className="flex gap-2 items-center flex-wrap">
          {/* Dropdown Filter Kategori */}
          <select 
            value={categoryId} 
            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            className="border rounded-md p-2 text-sm bg-white"
          >
            <option value="">-- Semua Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category}
              </option>
            ))}
          </select>

          {/* Input Keyword Pencarian */}
          <input 
            type="text" 
            placeholder="Cari produk..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-md p-2 text-sm bg-white"
          />

          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </div>

        <div>
          <Link to="/admin/add-product" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition">
            + Tambah Produk
          </Link>
        </div>
      </form>

      <table className="table-auto w-full border"> 
        <thead> 
          <tr className="bg-gray-100 text-left"> 
            <th className="p-2 border">#</th> 
            <th className="p-2 border">Image</th> 
            <th className="p-2 border">Nama</th> 
            <th className="p-2 border">Harga</th> 
            <th className="p-2 border">Stok</th> 
            <th className="p-2 border">Aksi</th> 
          </tr> 
        </thead> 
        <tbody> 
          {products?.length > 0 ? (
            products.map((p, index) => ( 
              <tr key={p.id}> 
                <td className="p-2 border">{(page - 1) * 5 + (index + 1)}</td> 
                <td className="p-2 border">
                  <img src={p.img_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
                </td> 
                <td className="p-2 border">
                  {p.name} <br /> 
                  <small className="text-gray-500">#{p.category?.category || p.category?.name}</small>
                </td> 
                <td className="p-2 border">Rp. {p.price}</td> 
                <td className="p-2 border">{p.stock}</td> 
                <td className="p-2 border space-x-2"> 
                  <Link to={`/admin/edit-product/${p.id}`} className="text-blue-600 hover:underline">Edit</Link> 
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    className="cursor-pointer text-red-600 hover:underline" 
                  > 
                    Hapus 
                  </button> 
                </td> 
              </tr> 
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">Tidak ada data produk ditemukan.</td>
            </tr>
          )}
        </tbody> 
      </table> 

      {/* PAGINATION CONTROL (Sesuai Modul 4.3.4) */}
      <div className="flex justify-between items-center mt-4 pt-2 border-t">
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          disabled={page === 1}
          className="bg-gray-200 px-4 py-2 rounded text-sm disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Sebelumnya
        </button>

        <span className="text-sm font-medium text-gray-700">
          Halaman Aktif: {page}
        </span>

        <button 
          onClick={() => setPage((prev) => prev + 1)} 
          disabled={products.length < 5} 
          className="bg-gray-200 px-4 py-2 rounded text-sm disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Berikutnya
        </button>
      </div>
    </div> 
  ); 
}