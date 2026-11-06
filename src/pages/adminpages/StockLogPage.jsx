import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";

export default function StockLogPage() {
  const queryClient = useQueryClient();
  const { products, getStockLogs, addStockLog } = useProducts();

  // State untuk form input transaksi stok
  const [formData, setFormData] = useState({
    product_id: "",
    type: "in", // "in" untuk Barang Masuk, "out" untuk Barang Keluar
    quantity: "",
    description: "",
  });

  // Ambil data riwayat stok menggunakan React Query
  const { data: stockLogs = [], isLoading, isError } = useQuery({
    queryKey: ["stock-logs"],
    queryFn: getStockLogs,
  });

  // Mutasi untuk menambah log stok baru
  const mutation = useMutation({
    mutationFn: addStockLog,
    onSuccess: () => {
      toast.success("Transaksi stok berhasil disimpan!");
      queryClient.invalidateQueries(["stock-logs"]);
      queryClient.invalidateQueries(["products"]);
      // Reset form
      setFormData({ product_id: "", type: "in", quantity: "", description: "" });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Terjadi kesalahan.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.quantity) {
      toast.error("Pilih produk dan masukkan jumlah stok!");
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) return <p className="p-4">Memuat data riwayat stok...</p>;
  if (isError) return <p className="p-4 text-red-500">Gagal memuat riwayat stok.</p>;

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <h1 className="text-xl font-bold">Manajemen Stok & Riwayat (Stock Opname)</h1>

      {/* FORM TRANSAKSI STOK MASUK / KELUAR */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border space-y-4">
        <h2 className="text-md font-semibold text-gray-700">+ Catat Masuk / Keluar Barang</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Pilih Produk */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Produk</label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full border rounded-md p-2 text-sm bg-white"
              required
            >
              <option value="">-- Pilih Produk --</option>
              {products?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stok Saat Ini: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Transaksi (Masuk / Keluar) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipe Transaksi</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border rounded-md p-2 text-sm bg-white"
            >
              <option value="in">Barang Masuk (Restock)</option>
              <option value="out">Barang Keluar (Terjual/Rusak)</option>
            </select>
          </div>

          {/* Jumlah Kuantitas */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Jumlah</label>
            <input
              type="number"
              min="1"
              placeholder="Contoh: 10"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full border rounded-md p-2 text-sm bg-white"
              required
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Keterangan</label>
            <input
              type="text"
              placeholder="Misal: Dari Supplier / Terjual"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md p-2 text-sm bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
        >
          {mutation.isLoading ? "Menyimpan..." : "Simpan Transaksi Stok"}
        </button>
      </form>

      {/* TABEL RIWAYAT STOK */}
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2">Riwayat Keluar Masuk Barang</h2>
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Waktu</th>
              <th className="p-2 border">Nama Produk</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {stockLogs.length > 0 ? (
              stockLogs.map((log, index) => (
                <tr key={log.id}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-2 border font-medium">{log.product?.name || "Produk Dihapus"}</td>
                  <td className="p-2 border">
                    {log.type === "in" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        MASUK (+{log.quantity})
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        KELUAR (-{log.quantity})
                      </span>
                    )}
                  </td>
                  <td className="p-2 border font-bold">{log.quantity}</td>
                  <td className="p-2 border text-gray-600">{log.description || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Belum ada riwayat transaksi stok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}