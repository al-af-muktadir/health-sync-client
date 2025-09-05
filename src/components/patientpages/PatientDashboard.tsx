/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getme, getMyStats } from "../auth/services/userService";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { useUser } from "@/api/Context/UserContext";

const PatientDashboard = () => {
  const [patient, setPatient] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const { user } = useUser();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Patient info
        const result = await getme();
        setPatient(result?.data || null);

        // Stats
        if (result.success) {
          const statsRes = await getMyStats(result?.data?.email);
          console.log("📊 Stats Response:", statsRes);
          setStats(statsRes?.data.data || null);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <div className="text-center text-violet-400 mt-20">Loading...</div>;
  }

  if (!patient) {
    return (
      <div className="text-center text-red-400 mt-20">
        Failed to load patient data.
      </div>
    );
  }

  // 🔹 Transform backend stats into recharts-friendly format
  const chartData = stats
    ? [
        { name: "Appointments", value: stats.totalAppointments },
        { name: "Prescriptions", value: stats.totalPrescriptions },
        { name: "Reports", value: stats.totalReports },
        { name: "Paid", value: stats.paidPayments },
        { name: "Unpaid", value: stats.unpaidPayments },
      ]
    : [];

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6">
      <div className="max-w-4xl mx-auto bg-[#111111] rounded-2xl shadow-2xl p-8 border border-violet-700">
        <h2 className="text-4xl font-bold text-violet-500 mb-8 text-center">
          Patient Dashboard
        </h2>

        {/* 🔹 Personal Info */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          {patient?.profilePhoto ? (
            <Image
              src={patient.profilePhoto}
              alt="Profile"
              width={120}
              height={120}
              className="w-32 h-32 object-cover rounded-full border-4 border-violet-500"
            />
          ) : (
            <div className="w-32 h-32 bg-violet-700 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {patient?.name?.charAt(0) || "P"}
            </div>
          )}

          <div className="space-y-3 text-lg">
            <p>
              <span className="font-semibold text-violet-400">Name:</span>{" "}
              {patient?.name}
            </p>
            <p>
              <span className="font-semibold text-violet-400">Email:</span>{" "}
              {patient?.email}
            </p>
            <p>
              <span className="font-semibold text-violet-400">Contact:</span>{" "}
              {patient?.contactNumber || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-violet-400">Address:</span>{" "}
              {patient?.address || "N/A"}
            </p>
          </div>
        </div>

        {/* 🔹 Stats Chart */}
        <div className="bg-[#1a1538] p-6 rounded-xl shadow-lg border border-violet-700">
          <h3 className="text-2xl font-semibold text-violet-400 mb-4 text-center">
            My Health & Appointment Stats
          </h3>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c0070" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1538", border: "none" }}
                />
                <Bar dataKey="value" fill="#b38bff" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">No stats available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
