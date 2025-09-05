/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createSchedule } from "@/components/auth/services/adminServices";
import { useState, useMemo } from "react";

type SchedulePayload = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
};

type Props = {
  onSubmit: (payload: SchedulePayload) => void;
};

const ScheduleCreator: React.FC<Props> = () => {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [error, setError] = useState<string | null>(null);

  const payload: SchedulePayload = useMemo(
    () => ({ startDate, endDate, startTime, endTime }),
    [startDate, endDate, startTime, endTime]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(startDate, endDate, startTime, endTime);
    const schedule = {
      startDate: String(startDate),
      endDate: String(endDate),
      startTime: String(startTime),
      endTime: String(endTime),
    };

    console.log("Schedule created:", schedule);
    const result = await createSchedule(schedule);
    console.log(result);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12 px-6 sm:px-12">
      {/* Glow Background */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#5f3dc4] via-[#a76bff] to-[#7b39f5] opacity-20 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl bg-[#150f2a] border border-[#3e2a70] backdrop-blur-sm p-10 rounded-none">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white">Create Schedule</h2>
          <p className="text-lg text-violet-200 mt-2 max-w-3xl">
            Define the date range and daily availability window.
          </p>
          <ul className="list-disc list-inside text-violet-300 space-y-3 mt-5 max-w-md">
            <li>Start and end dates must be valid.</li>
            <li>Time is based on 24-hour format.</li>
            <li>End date/time should be after start date/time.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-violet-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#2a1e57] text-white px-4 py-3 rounded-lg outline-none ring-1 ring-[#6f52c1] focus:ring-2 focus:ring-offset-1 focus:ring-[#b895ff] transition"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-violet-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#2a1e57] text-white px-4 py-3 rounded-lg outline-none ring-1 ring-[#6f52c1] focus:ring-2 focus:ring-offset-1 focus:ring-[#b895ff] transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-violet-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#2a1e57] text-white px-4 py-3 rounded-lg outline-none ring-1 ring-[#6f52c1] focus:ring-2 focus:ring-offset-1 focus:ring-[#d18bff] transition"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider text-violet-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#2a1e57] text-white px-4 py-3 rounded-lg outline-none ring-1 ring-[#6f52c1] focus:ring-2 focus:ring-offset-1 focus:ring-[#d18bff] transition"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-[#4b326f] px-5 py-3 text-base text-[#ffb3d9] max-w-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-xl">
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-[#c073ff] to-[#8f49ff] text-white font-semibold rounded-3xl shadow-lg hover:scale-[1.05] transition-transform"
            >
              Create
            </button>
            <div className="text-sm text-violet-300 select-text">
              JSON Preview:
            </div>
          </div>

          <pre className="bg-[#0a0a14] border border-[#5f4ec8] text-sm rounded-md p-6 overflow-x-auto text-[#e0d8ff] max-w-full">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCreator;
