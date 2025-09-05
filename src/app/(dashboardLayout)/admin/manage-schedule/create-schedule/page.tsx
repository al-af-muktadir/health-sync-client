// app/(dashboardLayout)/admin/manage-schedule/create-schedule/page.tsx
"use client";

import { createSchedule } from "@/components/auth/services/adminServices";
import {
  ScheduleCreator,
  SchedulePayload,
} from "../../../../../components/ScheduleCreator";
// import { createSchedule } from "";

export default function Page() {
  const handleSubmit = async (payload: SchedulePayload) => {
    try {
      const result = await createSchedule(payload);
      console.log("Schedule created:", result);
      alert("Schedule created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create schedule.");
    }
  };

  return <ScheduleCreator onSubmit={handleSubmit} />;
}
