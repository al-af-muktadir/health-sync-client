/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getDoctorsByDiseaseName } from "@/components/auth/services/userService";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaMoneyBill,
  FaUserCheck,
  FaHospital,
  FaGraduationCap,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import logo from "../../../../../public/Animation - 1749834497886.json";
import { useUser } from "@/api/Context/UserContext";

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

export default function PredictDiseaseByDoctor() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const prediction = searchParams.get("prediction");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prediction) {
      setError("No prediction provided in query params.");
      return;
    }

    const normalizedPrediction = prediction
      .toLowerCase()
      .replace(/[()\s]/g, "");

    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getDoctorsByDiseaseName(normalizedPrediction);
        setDoctors(res?.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [prediction]);

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center text-5xl font-extrabold tracking-wider text-violet-400"
      >
        Specialized Doctors for:{" "}
        <span className="text-white">{prediction}</span>
      </motion.h1>

      {loading && (
        <div className="flex justify-center py-8">
          <Lottie className="w-20" animationData={logo} loop />
        </div>
      )}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && doctors.length === 0 && (
        <p className="text-center text-gray-400">
          No doctors found for this disease.
        </p>
      )}

      {!loading && doctors.length > 0 && (
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
              {/* Image Placeholder on Top */}
              <div className="w-full h-64 relative">
                <Image
                  src={doc.profilePhoto || "/default-doctor.png"}
                  alt={doc.name}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </div>

              {/* Doctor Info Section */}
              <div className="p-6 space-y-3">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                  <FaUserMd className="text-violet-400" /> {doc.name}
                </h2>
                <p className="text-sm text-gray-300">{doc.designation}</p>
                <p className="text-sm font-medium text-violet-300">
                  {doc.specialty.title}
                </p>

                {/* Key Info Grid */}
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

                {/* Book Appointment Button */}
                {user?.role === "PATIENT" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 py-2 text-white font-semibold shadow-md transition-all hover:from-violet-700 hover:to-pink-700"
                  >
                    Book Appointment
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
