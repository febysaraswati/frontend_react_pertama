import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/apiClient";

export default function BookTable() {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  const { data: bookData, isLoading } = useQuery({
    queryKey: ["books", currentPage, searchKeyword],
    queryFn: async () => {
      const res = await api.get(`/library/books?page=${currentPage}&limit=${limit}&keyword=${searchKeyword}`);
      return res.data.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    queryClient.invalidateQueries(["books"]);
  };

  const booksList = Array.isArray(bookData) ? bookData : bookData?.data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Daftar Buku Terdaftar</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari judul atau penulis buku..."
          className="border rounded p-2 flex-grow"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          Cari
        </button>
      </form>

      {isLoading ? (
        <p>Memuat data buku...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">#</th>
                  <th className="p-3">Judul Buku</th>
                  <th className="p-3">Penulis</th>
                  <th className="p-3">Tahun</th>
                  <th className="p-3">Stok Tersedia</th>
                </tr>
              </thead>
              <tbody>
                {booksList.length > 0 ? (
                  booksList.map((book, index) => (
                    <tr key={book.book_id || book.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{(currentPage - 1) * limit + index + 1}</td>
                      <td className="p-3 font-medium">{book.title}</td>
                      <td className="p-3">{book.author}</td>
                      <td className="p-3">{book.year}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {book.stock} Unit
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      Tidak ada data buku ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Sebelumnya
            </button>
            <span className="text-sm font-medium">Halaman {currentPage}</span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={booksList.length < limit}
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Berikutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
}