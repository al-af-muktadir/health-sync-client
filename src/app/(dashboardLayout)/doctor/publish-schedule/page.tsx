"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getSchedules,
  saveSchedules,
} from "@/components/auth/services/doctorServices";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import Lottie from "lottie-react";
import logo from "../../../../../public/Animation - 1749834497886.json";

interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
}

export default function DoctorScheduleSelector() {
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [limit, setLimit] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSchedulesData = async () => {
    setLoading(true);
    try {
      const res = await getSchedules({
        startDate,
        endDate,
        sortBy: "startDateTime",
        sortOrder,
      });

      console.log(res);
      setAllSchedules(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesData();
  }, [startDate, endDate, sortOrder]);

  const schedules = useMemo(() => {
    const sorted = [...allSchedules].sort((a, b) => {
      const aTime = new Date(a.startDateTime).getTime();
      const bTime = new Date(b.startDateTime).getTime();
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });

    const total = Math.ceil(sorted.length / limit);
    setTotalPages(total);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return sorted.slice(startIndex, endIndex);
  }, [allSchedules, limit, page, sortOrder]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const formatDateTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const date = startDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const startTime = startDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = endDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date, timeRange: `${startTime} - ${endTime}` };
  };

  const saveSelection = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one schedule.");
      return;
    }

    const payload = { scheduleIds: selected };
    setLoading(true);
    try {
      const res = await saveSchedules(payload);
      if (res.data) {
        toast.success("Schedules saved successfully!");
        setSelected([]);
      } else {
        toast.error("Failed to save schedules.");
      }
    } catch (error) {
      console.error("Error saving schedules:", error);
      toast.error("Error saving schedules.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Lottie className="w-20" animationData={logo} loop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f021f] to-[#1c0033] text-white p-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-8 drop-shadow-[0_2px_6px_rgba(200,100,255,0.7)]">
        Select Your Availability
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-black/40 backdrop-blur-md border-2 border-violet-500/70 p-3 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 transition-all text-violet-100 placeholder-violet-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-black/40 backdrop-blur-md border-2 border-violet-500/70 p-3 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 transition-all text-violet-100"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="bg-black/40 backdrop-blur-md border-2 border-violet-500/70 p-3 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 transition-all text-violet-100"
        >
          {[6, 9, 12].map((num) => (
            <option key={num} value={num} className="bg-black text-white">
              {num} per page
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="bg-black/40 backdrop-blur-md border-2 border-violet-500/70 p-3 rounded-xl text-sm focus:ring-2 focus:ring-violet-400 transition-all text-violet-100"
        >
          <option value="asc" className="bg-black text-white">
            Ascending
          </option>
          <option value="desc" className="bg-black text-white">
            Descending
          </option>
        </select>
      </div>

      {/* Schedules */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {schedules.map((schedule, index) => {
          const { date, timeRange } = formatDateTime(
            schedule.startDateTime,
            schedule.endDateTime
          );

          return (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 35px rgba(190, 150, 255, 0.7)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className={cn(
                    "bg-black/40 backdrop-blur-xl border-2 border-violet-500/80 shadow-lg rounded-2xl transition-all overflow-hidden",
                    selected.includes(schedule.id) &&
                      "bg-violet-900/60 border-violet-300 shadow-[0_0_25px_rgba(200,150,255,0.9)]"
                  )}
                  onClick={() => toggleSelect(schedule.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-violet-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-violet-100">{timeRange}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4 items-center">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-gradient-to-r from-violet-700 to-fuchsia-600 border-2 border-violet-400 hover:opacity-90 disabled:opacity-40 rounded-xl px-5 py-2 font-semibold"
        >
          Prev
        </Button>
        <span className="text-violet-200 font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gradient-to-r from-violet-700 to-fuchsia-600 border-2 border-violet-400 hover:opacity-90 disabled:opacity-40 rounded-xl px-5 py-2 font-semibold"
        >
          Next
        </Button>
      </div>

      {/* Save Button */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: schedules.length * 0.05 }}
      >
        <Button
          onClick={saveSelection}
          className="bg-gradient-to-r from-violet-700 to-fuchsia-600 border-2 border-violet-300 hover:opacity-90 text-white px-8 py-3 rounded-2xl shadow-xl shadow-violet-500/50 font-semibold tracking-wide"
        >
          Save Availability
        </Button>
      </motion.div>
      <Toaster />
    </div>
  );
}
