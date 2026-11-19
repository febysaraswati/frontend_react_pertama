import React from "react";
import BookForm from "../../components/library/BookForm";
import BookTable from "../../components/library/BookTable";
import LoanForm from "../../components/library/LoanForm";
import LoanTable from "../../components/library/LoanTable";

export default function BookPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manajemen Perpustakaan</h1>
      
      {/* 1. Pendaftaran & Daftar Buku */}
      <BookForm />
      <BookTable />

      {/* 2. Pencatatan & Riwayat Peminjaman */}
      <LoanForm />
      <LoanTable />
    </div>
  );
}