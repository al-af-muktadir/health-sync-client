"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { fetchSpecialties } from "@/components/auth/services/userService";
import { toast } from "sonner";

// Define types
type Specialty = {
  id: string;
  title: string;
};

type Doctor = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  gender: string;
  profilePhoto?: string;
  appointmentFee: number;
  specialty?: Specialty;
};

type DoctorsResponse = {
  data: Doctor[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filters, setFilters] = useState({
    gender: "",
    specialties: "",
  });

  const fetchDoctors = async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", meta.page.toString());
      query.append("limit", meta.limit.toString());
      if (searchTerm.trim()) query.append("searchTerm", searchTerm);
      if (filters.gender) query.append("gender", filters.gender);
      if (filters.specialties) query.append("specialties", filters.specialties);

      const res = await axios.get<DoctorsResponse>(
        `NEXT_PUBLIC_BASE_URL/doctor?${query.toString()}`
      );

      setDoctors(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error("Error fetching doctors", err);
      toast.error("Failed to fetch doctors");
    }
  };

  const loadSpecialties = async () => {
    try {
      const res = await fetchSpecialties();
      setSpecialties(res.data || []);
    } catch (err) {
      console.error("Error fetching specialties", err);
      toast.error("Failed to fetch specialties");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`NEXT_PUBLIC_BASE_URL/doctor/${id}`);
      toast.success("Doctor deleted successfully!");
      fetchDoctors();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete doctor");
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.page, meta.limit, filters, searchTerm]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(meta.total / meta.limit)),
    [meta.total, meta.limit]
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1 text-white">
              Manage Doctors
            </h2>
            <p className="text-sm text-gray-400">
              View, filter, and manage registered doctors.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[220px]">
              <input
                type="text"
                placeholder="Search by name, email, contact..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 bg-[#1f1b3f] placeholder:text-gray-400 rounded-md border border-[#2f2a50] focus:outline-none focus:ring-2 focus:ring-[#6b5fd0]"
              />
            </div>
            <div>
              <select
                className="px-4 py-2 bg-[#1f1b3f] text-white rounded-md border border-[#2f2a50] focus:outline-none focus:ring-2 focus:ring-[#6b5fd0]"
                value={filters.gender}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, gender: e.target.value }));
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <select
                className="px-4 py-2 bg-[#1f1b3f] text-white rounded-md border border-[#2f2a50] focus:outline-none focus:ring-2 focus:ring-[#6b5fd0]"
                value={filters.specialties}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    specialties: e.target.value,
                  }));
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">All Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#0f0f17] rounded-xl border border-[#2f2a50]">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Photo
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Contact
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Gender
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Specialty
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white">
                  Fee
                </th>
                <th className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#3f2a7f] to-[#5f4ec8] text-white text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-[#2f2a50] hover:bg-[#1f1b3f] transition"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden">
                        <Image
                          src={doc.profilePhoto || "/default-avatar.png"}
                          alt="profile"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">{doc.name}</td>
                    <td className="px-4 py-3">{doc.email}</td>
                    <td className="px-4 py-3">{doc.contactNumber}</td>
                    <td className="px-4 py-3">{doc.gender}</td>
                    <td className="px-4 py-3">
                      {doc.specialty?.title || "N/A"}
                    </td>
                    <td className="px-4 py-3">{doc.appointmentFee}৳</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="inline-flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md transition text-white"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-gray-500 py-12 italic"
                  >
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            Showing page {meta.page} of {totalPages} ({meta.total} doctors)
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-[#1f1b3f] rounded-md text-white disabled:opacity-40 border border-[#2f2a50] hover:ring-1 hover:ring-[#6b5fd0] transition"
              disabled={meta.page <= 1}
              onClick={() =>
                setMeta((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
            >
              Prev
            </button>
            <button
              className="px-4 py-2 bg-[#1f1b3f] rounded-md text-white disabled:opacity-40 border border-[#2f2a50] hover:ring-1 hover:ring-[#6b5fd0] transition"
              disabled={meta.page >= totalPages}
              onClick={() =>
                setMeta((prev) => ({
                  ...prev,
                  page: Math.min(totalPages, prev.page + 1),
                }))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
