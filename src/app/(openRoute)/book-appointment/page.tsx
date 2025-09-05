"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  FaUserMd,
  FaMoneyBill,
  FaUserCheck,
  FaHospital,
  FaGraduationCap,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa";
import { getAllDoctors } from "@/components/auth/services/doctorServices";
import { getSpecialties } from "@/components/auth/services/adminServices";
import logo from "../../../../public/Animation - 1749834497886.json";
import { useRouter } from "next/navigation";

// Doctor interface
interface Doctor {
  id: string;
  name: string;
  profilePhoto?: string;
  designation: string;
  specialty: { id: string; title: string; icon?: string };
  experience: number;
  appointmentFee: number;
  contactNumber: string;
  currentWorkingPlace: string;
  qualification: string;
  registrationNumber: string;
  email: string;
}

// Specialty interface
interface Specialty {
  id: string;
  title: string;
  icon?: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialtyRes, setSpecialtyRes] = useState<Specialty[]>([]);
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // Fetch all specialties
  const fetchSpecialties = async () => {
    try {
      const res = await getSpecialties();
      if (res.data) {
        setSpecialtyRes(res.data as Specialty[]);
      }
    } catch (err) {
      console.error("Error fetching specialties", err);
    }
  };

  // Fetch doctors with filters
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getAllDoctors({
        page,
        limit: 6,
        searchTerm,
        specialties: specialty,
        gender,
      });
      setDoctors(res.data || []);
      setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
    } catch (err) {
      console.error("Error fetching doctors", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [page, searchTerm, specialty, gender]);

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center text-5xl font-extrabold tracking-wider text-violet-400"
      >
        Find Your Doctor
      </motion.h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-violet-500/30 focus:outline-none focus:border-violet-400"
        />
        <select
          value={specialty}
          onChange={(e) => {
            setPage(1);
            setSpecialty(e.target.value);
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-violet-500/30"
        >
          <option value="">All Specialties</option>
          {specialtyRes.map((sp) => (
            <option key={sp.id} value={sp.title}>
              {sp.title}
            </option>
          ))}
        </select>
        <select
          value={gender}
          onChange={(e) => {
            setPage(1);
            setGender(e.target.value);
          }}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-violet-500/30"
        >
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <Lottie className="w-20" animationData={logo} loop />
        </div>
      )}

      {/* Doctors List */}
      {!loading && doctors.length > 0 ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(139,92,246,0.5)",
              }}
              className="relative rounded-xl border border-violet-600/30 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg backdrop-blur-sm hover:border-violet-500/60 transition-all duration-300"
            >
              <div className="w-full h-64 relative">
                <Image
                  src={doc.profilePhoto || "/default-doctor.png"}
                  alt={doc.name}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="p-6 space-y-3">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                  <FaUserMd className="text-violet-400" /> {doc.name}
                </h2>
                <p className="text-sm text-gray-300">{doc.designation}</p>
                <p className="text-sm font-medium text-violet-300">
                  {doc.specialty.title}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3 text-gray-300">
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30">
                    <FaIdCard className="text-pink-400" />{" "}
                    {doc.registrationNumber}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30">
                    <FaGraduationCap className="text-yellow-400" />{" "}
                    {doc.qualification}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30">
                    <FaUserCheck className="text-teal-400" /> {doc.experience}{" "}
                    yrs
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30">
                    <FaMoneyBill className="text-green-400" /> $
                    {doc.appointmentFee}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30 col-span-2">
                    <FaHospital className="text-red-400" />{" "}
                    {doc.currentWorkingPlace}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1 border border-violet-500/30 col-span-2">
                    <FaEnvelope className="text-orange-400" /> {doc.email}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/book-appointment/${doc.id}`)}
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 py-2 text-white font-semibold shadow-md transition-all hover:from-violet-700 hover:to-pink-700"
                >
                  Book Appointment
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !loading && doctors.length === 0 ? (
        <div className="flex flex-col items-center mt-16 text-white">
          <Lottie className="w-20" animationData={logo} loop />
          <p className="mt-4 text-xl font-semibold">No doctor available</p>
        </div>
      ) : null}

      {/* Pagination */}
      {!loading && doctors.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-violet-500/30 disabled:opacity-50 hover:bg-violet-600 transition-all"
          >
            Previous
          </button>
          <span className="text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-violet-500/30 disabled:opacity-50 hover:bg-violet-600 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
