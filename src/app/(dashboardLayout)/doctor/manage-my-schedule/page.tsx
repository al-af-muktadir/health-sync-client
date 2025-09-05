"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  DeleteSchedules,
  mySchedules,
} from "@/components/auth/services/doctorServices";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function ScheduleTable() {
  type ScheduleItem = {
    isBooked: boolean;
    schedule: {
      id: string;
      startDateTime: string;
      endDateTime: string;
    };
  };

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter state
  const [filterBooked, setFilterBooked] = useState<string>("all"); // all, available, booked

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const query: Record<string, string | number | boolean> = { page, limit };
      if (filterBooked === "available") query.isBooked = false;
      else if (filterBooked === "booked") query.isBooked = true;

      console.log("[v0] Fetching schedules with query:", query);
      const res = await mySchedules(query);
      console.log("[v0] API response:", res);

      // Set schedules from API response
      setSchedules(res.data?.data || []);

      const meta = res.data?.meta || {};
      const total = meta.total || 0;
      const currentLimit = meta.limit || limit;
      const calculatedTotalPages = Math.max(1, Math.ceil(total / currentLimit));

      console.log("[v0] Pagination meta:", {
        total,
        currentLimit,
        calculatedTotalPages,
      });
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("[v0] Error fetching schedules:", err);
      toast.error("Failed to fetch schedules.");
      setSchedules([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filter changes
  useEffect(() => {
    console.log("[v0] Filter changed to:", filterBooked);
    setPage(1);
  }, [filterBooked]);

  // Fetch schedules whenever page or filter changes
  useEffect(() => {
    console.log(
      "[v0] Fetching schedules - page:",
      page,
      "filter:",
      filterBooked
    );
    fetchSchedules();
  }, [page, filterBooked]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await DeleteSchedules(selectedId);
      if (res.success) {
        toast.success("Schedule deleted!");
        fetchSchedules();
      } else {
        toast.error("Failed to delete schedule.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting schedule.");
    } finally {
      setShowModal(false);
      setSelectedId(null);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f021f] to-[#1c0033] text-white p-8">
      <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
        Your Schedules
      </h1>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-violet-300 font-semibold">Filter:</span>
        <select
          className="bg-black border border-violet-600 text-violet-500  p-2 rounded"
          value={filterBooked}
          onChange={(e) => setFilterBooked(e.target.value)}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
      </div>

      <Card className="bg-black/30 backdrop-blur-md border border-violet-600 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-violet-300">
            Schedule List
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-violet-600">
            <thead className="bg-violet-800/40 text-violet-200">
              <tr>
                <th className="px-4 py-2 border border-violet-600">#</th>
                <th className="px-4 py-2 border border-violet-600">Date</th>
                <th className="px-4 py-2 border border-violet-600">Time</th>
                <th className="px-4 py-2 border border-violet-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-violet-300">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule, idx) => {
                  const { date, timeRange } = formatDateTime(
                    schedule.schedule.startDateTime,
                    schedule.schedule.endDateTime
                  );
                  return (
                    <motion.tr
                      key={schedule.schedule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-violet-900/40 transition-all"
                    >
                      <td className="px-4 py-2 border border-violet-600 text-center">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-4 py-2 border border-violet-600 text-center">
                        {date}
                      </td>
                      <td className="px-4 py-2 border border-violet-600 text-center">
                        {timeRange}
                      </td>
                      <td className="px-4 py-2 border border-violet-600 text-center">
                        <Button
                          size="sm"
                          disabled={schedule.isBooked}
                          className={`${
                            schedule.isBooked
                              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-700 to-fuchsia-600 hover:opacity-90"
                          }`}
                          onClick={() => {
                            if (!schedule.isBooked) {
                              setSelectedId(schedule.schedule.id);
                              setShowModal(true);
                            }
                          }}
                        >
                          {schedule.isBooked ? "Booked" : "Delete"}
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="bg-violet-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Prev
            </Button>
            <span className="text-violet-300">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="bg-violet-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-gradient-to-br from-black via-[#1a012c] to-[#2a003f] p-6 rounded-2xl shadow-2xl border border-violet-600 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-violet-300 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this schedule?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-red-700 to-fuchsia-600 hover:opacity-90"
                onClick={handleDelete}
              >
                Yes, Delete
              </Button>
              <Button
                className="bg-violet-700 hover:bg-violet-800"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
