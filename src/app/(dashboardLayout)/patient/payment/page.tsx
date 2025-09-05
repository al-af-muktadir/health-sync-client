/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { fetchMyPayments } from "@/components/auth/services/userService";

interface Payment {
  id: string;
  appointment: {
    patient: { name: string };
    doctor: { name: string; specialty: { title: string } };
  };
  amount: number;
  status: string;
  createdAt: string;
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetchMyPayments({ page, limit });
      setPayments(res.data.payments);
      setTotal(res.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
      toast.error(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-violet-400 mb-6">My Payments</h1>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left border border-violet-700">
          <thead className="bg-violet-900 text-violet-300 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Specialty</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading…
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-violet-700 hover:bg-violet-950"
                >
                  <td className="px-6 py-3">{p.appointment.patient.name}</td>
                  <td className="px-6 py-3">{p.appointment.doctor.name}</td>
                  <td className="px-6 py-3">
                    {p.appointment.doctor.specialty.title}
                  </td>
                  <td className="px-6 py-3">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-3">{p.status}</td>
                  <td className="px-6 py-3">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Previous
        </Button>
        <span className="text-white self-center">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Next
        </Button>
      </div>

      <Toaster />
    </div>
  );
}
