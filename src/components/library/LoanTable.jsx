import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/apiClient";

export default function LoanTable() {
  const { data: loans, isLoading } = useQuery({
    queryKey: ["book-loans"],
    queryFn: async () => {
      const res = await api.get("/library/loans");
      return res.data.data;
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Riwayat Peminjaman Buku</h2>
      {isLoading ? (
        <p>Memuat riwayat peminjaman...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">#</th>
                <th className="p-3">Nama Peminjam</th>
                <th className="p-3">Judul Buku</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans && loans.length > 0 ? (
                loans.map((loan, index) => (
                  <tr key={loan.loan_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{loan.borrower_name}</td>
                    <td className="p-3">{loan.book ? loan.book.title : "Buku Dihapus"}</td>
                    <td className="p-3">{loan.quantity} Unit</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Belum ada riwayat peminjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}