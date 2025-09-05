"use client";

import {
  deletePatientData,
  fetchPatients,
  updatePatientStatus,
} from "@/components/auth/services/adminServices";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast, Toaster } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type ApiPatient = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  gender?: string;
  address?: string;
  profilePhoto?: string | null;
  createdAt: string;
  user: { status: "ACTIVE" | "BLOCK" | "DELETED" };
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PatientViewTable: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [emailFilter, setEmailFilter] = useState(
    searchParams.get("email") || ""
  );
  const [contactFilter, setContactFilter] = useState(
    searchParams.get("contactNo") || ""
  );

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1"); // reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPatients({
        page: currentPage,
      });

      setPatients(res.data);
      console.log(res);
      const { total, limit } = res.meta;
      setTotalPages(Math.ceil(total / limit));
    } catch (e) {
      console.error(e);
      setError("Could not load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [searchParams.toString()]);

  const updateStatus = async (email: string, status: "ACTIVE" | "BLOCK") => {
    setPatients((p) =>
      p.map((pt) =>
        pt.email === email ? { ...pt, user: { ...pt.user, status } } : pt
      )
    );
    const res = await updatePatientStatus(email, status);
    if (res.success) {
      toast.success("SUCCESSFUL");
    } else {
      toast.error("FAILED");
    }
  };

  const deletePatient = async (id: string) => {
    setMutatingId(id);
    try {
      await deletePatientData(id);
      toast.success("Patient deleted successfully.");
      load();
    } catch {
      toast.error("Failed to delete patient.");
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <div className="min-h-full bg-black p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Patient List</h2>
          <p className="text-sm text-violet-300 mt-1">
            View all patients. Toggle status or delete as needed.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-[#4b326f] px-4 py-2 text-sm text-[#ffb3d9]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-violet-300 py-20">
          Loading patients...
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg-[#111] border border-violet-800 shadow-lg">
            <table className="w-full table-auto text-left">
              <thead className="bg-[#1a1a1a] border-b border-violet-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Address
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-violet-200 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-violet-900 last:border-b-0 hover:bg-[#1a1a1a] transition"
                  >
                    <td className="px-4 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a1e57] flex-shrink-0">
                        {p.profilePhoto ? (
                          <Image
                            src={p.profilePhoto}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center text-xs text-violet-300 h-full">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {p.name}
                        </div>
                        <div className="text-xs text-violet-400 mt-1 truncate">
                          {p.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-violet-200">{p.email}</td>
                    <td className="px-4 py-4 text-white">{p.contactNumber}</td>
                    <td className="px-4 py-4 text-violet-200">
                      {p.address || "-"}
                    </td>
                    <td className="px-4 py-4 text-violet-300">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 max-w-[240px]">
                        <button
                          disabled={mutatingId === p.id}
                          onClick={() => updateStatus(p.email, "ACTIVE")}
                          className={`flex-1 px-4 py-2 font-semibold rounded-full text-sm uppercase ${
                            p.user.status === "ACTIVE"
                              ? "bg-gradient-to-r from-violet-600 to-violet-400 text-white shadow-lg"
                              : "bg-black text-violet-300 border border-violet-600 hover:bg-[#1a1a1a]"
                          }`}
                        >
                          ACTIVE
                        </button>
                        <button
                          disabled={mutatingId === p.id}
                          onClick={() => updateStatus(p.email, "BLOCK")}
                          className={`flex-1 px-4 py-2 font-semibold rounded-full text-sm uppercase ${
                            p.user.status === "BLOCK"
                              ? "bg-red-600 text-white shadow-lg"
                              : "bg-black text-violet-300 border border-violet-600 hover:bg-[#1a1a1a]"
                          }`}
                        >
                          BLOCK
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        disabled={mutatingId === p.id}
                        onClick={() => deletePatient(p.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-black border border-red-600 hover:bg-red-700 rounded-full text-sm text-white font-semibold transition"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 rounded border border-violet-700 text-violet-300 hover:bg-violet-800 disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-violet-600 text-white font-bold"
                      : "text-violet-300 border border-violet-700 hover:bg-violet-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 rounded border border-violet-700 text-violet-300 hover:bg-violet-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}

      <Toaster />
    </div>
  );
};

export default PatientViewTable;
