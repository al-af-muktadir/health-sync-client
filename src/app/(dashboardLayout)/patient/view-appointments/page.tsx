"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/api/Context/UserContext";
import { fetchMyAppointments } from "@/components/auth/services/userService";

interface Prescription {
  id: string;
  instructions: string;
  followUpDate?: string;
}

interface Appointment {
  id: string;
  schedule: { startDateTime: string; endDateTime: string };
  doctor: { name: string; specialty: { title: string } };
  patient: {
    name: string;
    medical_report: { reportName: string; reportLink: string }[];
    patient_health_data?: {
      gender: string;
      dateOfBirth: string;
      bloodGroup: string;
      height: string;
      weight: string;
    };
  };
  prescription?: Prescription | null; // <-- Added
  paymentStatus: "PAID" | "UNPAID";
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELLED";
  videoCallingId?: string;
}

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useUser();

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      const data = await fetchMyAppointments();
      setAppointments(data.data.data);
    };
    loadAppointments();
  }, []);

  const handleViewPrescription = (prescription?: Prescription | null) => {
    setSelectedPrescription(prescription ?? null);
    setShowPrescriptionModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-violet-500 tracking-wide">
        My Appointments
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-violet-600 rounded-xl">
          <thead className="bg-violet-900 text-violet-300 uppercase text-sm tracking-wider">
            <tr>
              <th className="px-6 py-3">Schedule</th>
              <th className="px-6 py-3">
                {user?.role === "PATIENT" ? "Doctor" : "Patient"}
              </th>
              <th className="px-6 py-3">Specialty</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Payment</th>
              {user?.role === "DOCTOR" && (
                <th className="px-6 py-3">Medical Report</th>
              )}
              {user?.role === "DOCTOR" && (
                <th className="px-6 py-3">Health Data</th>
              )}
              <th className="px-6 py-3">Prescription</th>
              <th className="px-6 py-3">Video Call</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => (
              <tr
                key={apt.id}
                className="border-b border-violet-700 hover:bg-violet-950 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>
                      {new Date(apt.schedule.startDateTime).toLocaleString()}
                    </span>
                    <span className="text-sm text-violet-400">
                      {new Date(apt.schedule.endDateTime).toLocaleTimeString()}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {user?.role === "PATIENT"
                    ? apt.doctor.name
                    : apt.patient?.name}
                </td>

                <td className="px-6 py-4">{apt.doctor.specialty.title}</td>
                <td className="px-6 py-4 font-semibold">{apt.status}</td>

                <td className="px-6 py-4 font-semibold">
                  {apt.paymentStatus === "PAID" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </td>

                {user?.role === "DOCTOR" && (
                  <td className="px-6 py-4">
                    {apt.patient.medical_report.length > 0 ? (
                      <ul className="flex flex-col gap-1">
                        {apt.patient.medical_report.map((r) => (
                          <a
                            key={r.reportName}
                            href={r.reportLink}
                            target="_blank"
                            className="text-violet-400 hover:underline"
                          >
                            {r.reportName}
                          </a>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No reports</span>
                    )}
                  </td>
                )}

                {user?.role === "DOCTOR" && (
                  <td className="px-6 py-4">
                    {apt.patient.patient_health_data ? (
                      <ul className="text-violet-300 text-sm space-y-1">
                        <li>
                          Gender: {apt.patient.patient_health_data.gender}
                        </li>
                        <li>
                          DOB:{" "}
                          {new Date(
                            apt.patient.patient_health_data.dateOfBirth
                          ).toLocaleDateString()}
                        </li>
                        <li>
                          Blood Group:{" "}
                          {apt.patient.patient_health_data.bloodGroup}
                        </li>
                        <li>
                          Height: {apt.patient.patient_health_data.height}
                        </li>
                        <li>
                          Weight: {apt.patient.patient_health_data.weight}
                        </li>
                      </ul>
                    ) : (
                      <span className="text-gray-500">No health data</span>
                    )}
                  </td>
                )}

                {/* Prescription View Button */}
                <td className="px-6 py-4">
                  <Button
                    onClick={() => handleViewPrescription(apt.prescription)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    View Prescription
                  </Button>
                </td>

                {/* Video Call */}
                <td className="px-6 py-4">
                  <Button
                    onClick={() =>
                      (window.location.href = `/patient/video-call/${apt.id}`)
                    }
                    disabled={
                      !(
                        (apt.status === "SCHEDULED" ||
                          apt.status === "INPROGRESS") &&
                        apt.paymentStatus === "PAID"
                      )
                    }
                    className={`w-full rounded-lg transition ${
                      (apt.status === "SCHEDULED" ||
                        apt.status === "INPROGRESS") &&
                      apt.paymentStatus === "PAID"
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {(apt.status === "SCHEDULED" ||
                      apt.status === "INPROGRESS") &&
                    apt.paymentStatus === "PAID"
                      ? "Join Call"
                      : apt.paymentStatus !== "PAID"
                      ? "Payment Pending"
                      : "Not Scheduled"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-white rounded-xl p-6 w-full max-w-md">
            {selectedPrescription ? (
              <>
                <h3 className="text-xl font-bold mb-4">Prescription</h3>
                <p className="mb-2">
                  <span className="font-semibold">Instructions:</span>{" "}
                  {selectedPrescription.instructions}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Follow Up Date:</span>{" "}
                  {selectedPrescription.followUpDate
                    ? new Date(
                        selectedPrescription.followUpDate
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </>
            ) : (
              <h3 className="text-lg font-semibold text-red-400">
                You have not been assigned a prescription yet.
              </h3>
            )}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowPrescriptionModal(false)}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
