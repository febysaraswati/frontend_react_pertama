import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/apiClient";
import toast from "react-hot-toast";

export default function LoanForm() {
  const queryClient = useQueryClient();
  const [loanForm, setLoanForm] = useState({
    book_id: "",
    borrower_name: "",
    quantity: "",
  });

  const { data: bookData } = useQuery({
    queryKey: ["books-select"],
    queryFn: async () => {
      const res = await api.get("/library/books");
      return res.data.data;
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: async (newLoan) => {
      const res = await api.post("/library/loans", newLoan);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Peminjaman buku berhasil dicatat!");
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["books-select"]);
      queryClient.invalidateQueries(["book-loans"]);
      setLoanForm({ book_id: "", borrower_name: "", quantity: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mencatat peminjaman.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanForm.book_id || !loanForm.borrower_name || !loanForm.quantity) {
      toast.error("Harap isi semua kolom peminjaman!");
      return;
    }
    createLoanMutation.mutate(loanForm);
  };

  const booksList = Array.isArray(bookData) ? bookData : bookData?.data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">+ Catat Peminjaman Buku</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pilih Buku</label>
          <select
            className="w-full border rounded p-2"
            value={loanForm.book_id}
            onChange={(e) => setLoanForm({ ...loanForm, book_id: e.target.value })}
          >
            <option value="">-- Pilih Buku --</option>
            {booksList.map((b) => (
              <option key={b.book_id || b.id} value={b.book_id || b.id}>
                {b.title} (Stok: {b.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nama Peminjam</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Nama Peminjam"
            value={loanForm.borrower_name}
            onChange={(e) => setLoanForm({ ...loanForm, borrower_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jumlah Dipinjam</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Jumlah"
            value={loanForm.quantity}
            onChange={(e) => setLoanForm({ ...loanForm, quantity: e.target.value })}
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={createLoanMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {createLoanMutation.isPending ? "Menyimpan..." : "Simpan Peminjaman"}
          </button>
        </div>
      </form>
    </div>
  );
}