import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/apiClient";
import toast from "react-hot-toast";

export default function BookForm() {
  const queryClient = useQueryClient();
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    year: "",
    stock: "",
  });

  const createBookMutation = useMutation({
    mutationFn: async (newBook) => {
      const res = await api.post("/library/books", newBook);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Buku baru berhasil didaftarkan!");
      queryClient.invalidateQueries(["books"]);
      setBookForm({ title: "", author: "", year: "", stock: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mendaftarkan buku.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author || !bookForm.year || !bookForm.stock) {
      toast.error("Harap isi semua kolom pendaftaran buku!");
      return;
    }
    createBookMutation.mutate(bookForm);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">+ Daftarkan Buku Baru</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Buku</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Contoh: Pemrograman Web Modern"
            value={bookForm.title}
            onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Penulis / Pengarang</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Nama Penulis"
            value={bookForm.author}
            onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tahun Terbit</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Contoh: 2026"
            value={bookForm.year}
            onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jumlah Stok</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Jumlah Stok Buku"
            value={bookForm.stock}
            onChange={(e) => setBookForm({ ...bookForm, stock: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={createBookMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {createBookMutation.isPending ? "Menyimpan..." : "Daftarkan Buku"}
          </button>
        </div>
      </form>
    </div>
  );
}