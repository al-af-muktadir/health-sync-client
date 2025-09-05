"use client";

import { Suspense } from "react";
// import PatientViewTable from "./PatientViewTable";
import PredictDiseaseByDoctor from "@/components/Basics/PredictDiseaseyy";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div>Loading patients...</div>}>
      <PredictDiseaseByDoctor />
    </Suspense>
  );
}
