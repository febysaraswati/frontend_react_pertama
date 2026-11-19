import React from "react";
import LoanForm from "../../components/library/LoanForm";
import LoanTable from "../../components/library/LoanTable";

export default function LoanPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Manajemen Perpustakaan - Peminjaman Buku</h1>
      <LoanForm />
      <LoanTable />
    </div>
  );
}