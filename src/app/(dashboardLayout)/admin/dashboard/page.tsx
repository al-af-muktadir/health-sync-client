/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { getAdminDashboard } from "@/components/auth/services/adminServices";
import { toast } from "sonner";
import { motion } from "framer-motion";

const COLORS = ["#8B5CF6", "#C084FC", "#A78BFA", "#7C3AED"];

// Custom Tooltip for PieChart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          backgroundColor: "#1F2937",
          padding: "8px 12px",
          borderRadius: 8,
          color: "#C084FC", // violet text
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{data.name}</p>
        <p style={{ margin: 0 }}>Count: {data.value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        if (res.success) {
          toast.success("Data Fetched Successfully");
          setAdmin(res?.data?.admin);

          const formattedPie = res?.data?.stats.appointmentStatusCounts.map(
            (item: any) => ({
              name: item.status,
              value: item._count.status,
            })
          );
          setPieData(formattedPie);

          setLineData(res?.data?.stats.lastSixMonthsAppointments || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboard();
  }, []);

  return (
    <motion.div
      className="p-6 grid gap-6 md:grid-cols-2 min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #000000, #1E0F3, #5B21B6)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Admin Info */}
      <motion.div
        className="flex flex-col"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="flex-1 shadow-xl hover:shadow-violet-700 transition rounded-2xl bg-gray-900 border border-violet-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-violet-400">
              Admin Info
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4 h-full">
            {admin?.profilePhoto && (
              <Image
                src={admin.profilePhoto}
                alt={admin.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-violet-500 shadow-lg"
              />
            )}
            <div className="flex flex-col justify-center">
              <p className="font-bold text-lg text-violet-300">{admin?.name}</p>
              <p className="text-gray-400">{admin?.email}</p>
              <p className="text-sm text-gray-400">
                Contact: {admin?.contactNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-400">
                Joined:{" "}
                {admin && new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pie Chart */}
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
        <Card className="flex-1 shadow-xl hover:shadow-violet-700 transition rounded-2xl bg-gray-900 border border-violet-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-violet-400">
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={{ fill: "#fff", fontWeight: "bold" }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend wrapperStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Line Chart */}
      <motion.div
        className="col-span-2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-xl hover:shadow-violet-700 transition rounded-2xl bg-gray-900 border border-violet-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-violet-400">
              Appointments (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="month" stroke="#C4B5FD" />
                <YAxis stroke="#C4B5FD" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    color: "#C084FC", // violet text
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#A78BFA"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
