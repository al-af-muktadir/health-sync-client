"use client";

import PatientViewTable from "@/components/Basics/ManagePatientComp";
import { Suspense } from "react";
// import PatientViewTable from "./PatientViewTable";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div>Loading patients...</div>}>
      <PatientViewTable />
    </Suspense>
  );
}
