"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";
import { fetchDoctorDashboard } from "@/components/auth/services/doctorServices";
import Lottie from "lottie-react";
import loader from "../../../../../public/Animation - 1749834497886.json";
import { motion } from "framer-motion";

interface DoctorDashboardProps {
  doctorInfo: {
    name: string;
    email: string;
    specialty: string;
    experience: number;
    appointmentFee: number;
    profilePhoto?: string | null;
  };
  stats: {
    totalAppointments: number;
    upcomingAppointments: number;
    totalPatients: number;
    totalRevenue: number;
  };
  chartData: {
    appointmentsOverTime: { date: string; count: number }[];
  };
}

const DoctorDashboard: React.FC = () => {
  const [data, setData] = useState<DoctorDashboardProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDoctorDashboard();
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Lottie className="w-32" animationData={loader} loop />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error fetching dashboard data
      </div>
    );
  }

  const { doctorInfo, stats, chartData } = data;

  // const gradientColors = ["#7F00FF", "#E100FF"];

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Doctor Info */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center bg-gradient-to-r from-violet-900 to-black rounded-2xl shadow-xl p-6 mb-10"
        >
          {doctorInfo.profilePhoto && (
            <Image
              src={doctorInfo.profilePhoto}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full mr-6 border-4 border-violet-600 shadow-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-violet-400">
              {doctorInfo.name}
            </h1>
            <p className="text-gray-300">{doctorInfo.email}</p>
            <p className="text-gray-300">Specialty: {doctorInfo.specialty}</p>
            <p className="text-gray-300">
              Experience: {doctorInfo.experience} years
            </p>
            <p className="text-gray-300">
              Appointment Fee: ${doctorInfo.appointmentFee}
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Total Appointments",
              value: stats.totalAppointments,
              color: "violet",
            },
            {
              title: "Upcoming Appointments",
              value: stats.upcomingAppointments,
              color: "pink",
            },
            {
              title: "Total Patients",
              value: stats.totalPatients,
              color: "cyan",
            },
            {
              title: "Total Revenue",
              value: `$${stats.totalRevenue.toFixed(2)}`,
              color: "yellow",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br from-${stat.color}-800 to-black border border-${stat.color}-600/50 hover:scale-105 transition-transform duration-300`}
            >
              <h2 className={`text-lg font-semibold text-${stat.color}-300`}>
                {stat.title}
              </h2>
              <p className={`text-3xl font-bold text-${stat.color}-400 mt-2`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Appointments Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-violet-900 to-black p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold text-violet-400 mb-6">
            Appointments Over Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData.appointmentsOverTime}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E100FF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7F00FF" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B0082" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a0339",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
