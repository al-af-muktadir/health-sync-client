/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import {
  fetchMyAppointments,
  FetchAppointmentsQuery,
} from "@/components/auth/services/userService";
import {
  createPrescription,
  UpdateStatus,
} from "@/components/auth/services/doctorServices";
import logo from "../../../../../public/Animation - 1749834497886.json";
import Lottie from "lottie-react";

interface Appointment {
  id: string;
  patient: any;
  schedule: any;
  status: string;
  paymentStatus: string;
  prescription?: any;
}

export default function DoctorAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [viewPrescription, setViewPrescription] = useState<any>(null);

  // Health Data Modal
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedHealthData, setSelectedHealthData] = useState<any>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setHasFetched(false);
    try {
      const query: FetchAppointmentsQuery = {
        searchTerm: search,
        status: statusFilter,
        paymentStatus: paymentFilter,
        page,
        limit,
      };
      const res = await fetchMyAppointments(query);
      if (res.data) {
        setAppointments(res.data.data);
        setTotalPages(Math.ceil(res.data.meta.total / limit));
      } else {
        setAppointments([]);
        toast.error(res.message || "Failed to load appointments");
      }
    } catch (err) {
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [search, statusFilter, paymentFilter, page]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const data = await UpdateStatus(id, { status: newStatus });
    if (data.success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      toast.success("Status Updated Successfully");
    } else {
      toast.error(data.message || "Failed to Update Status");
    }
  };

  const handleOpenCreatePrescriptionModal = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setInstructions("");
    setFollowUpDate("");
    setShowCreateModal(true);
  };

  const handleOpenViewPrescriptionModal = (presc: any) => {
    setViewPrescription(presc);
    setShowViewModal(true);
  };

  const handleCreatePrescription = async () => {
    if (!instructions) return toast.error("Instructions required");
    setCreating(true);
    try {
      const payload = {
        instructions,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      };
      const res = await createPrescription(selectedAppointment?.id, payload);
      if (res.success) {
        toast.success("Prescription created successfully");
        fetchAppointments();
        setShowCreateModal(false);
      } else {
        toast.error(res.message || "Failed to create prescription");
      }
    } catch (err) {
      toast.error("Failed to create prescription");
    } finally {
      setCreating(false);
    }
  };

  const handleViewHealthData = (healthData: any) => {
    setSelectedHealthData(healthData);
    setShowHealthModal(true);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-600 text-white hover:bg-blue-500";
      case "INPROGRESS":
        return "bg-yellow-500 text-black hover:bg-yellow-400";
      case "COMPLETED":
        return "bg-green-600 text-white hover:bg-green-500";
      case "CANCELLED":
        return "bg-red-600 text-white hover:bg-red-500";
      default:
        return "bg-gray-500 text-white hover:bg-gray-400";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-black via-[#1a0b2e] to-black min-h-screen text-white">
      <h2 className="text-3xl font-extrabold mb-6 text-violet-400 tracking-wide">
        🩺 My Appointments
      </h2>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by patient/Contact"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-sm w-full max-w-xs rounded-xl bg-black text-violet-400 border border-violet-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select select-sm w-full max-w-xs rounded-xl bg-black text-violet-400 border border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="INPROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          className="select select-sm w-full max-w-xs rounded-xl bg-black text-violet-400 border border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-2xl rounded-xl border border-violet-700/40">
        <table className="table w-full">
          <thead className="bg-gradient-to-r from-violet-900 via-black to-violet-900 text-violet-300">
            <tr>
              <th>Patient</th>
              <th>Contact</th>
              <th>Health Data</th>
              <th>Medical Reports</th>
              <th>Schedule</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Prescription</th>
              <th>Call</th>
            </tr>
          </thead>
          <tbody className="bg-black/40 backdrop-blur-lg">
            {loading && !hasFetched ? (
              <tr>
                <td colSpan={9} className="py-10">
                  <div className="flex justify-center items-center h-full">
                    <Lottie className="w-24" animationData={logo} loop />
                  </div>
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-400">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appt, i) => (
                <tr
                  key={appt.id}
                  className={`border-b border-violet-800/40 hover:bg-violet-900/30 transition duration-300 ${
                    i % 2 === 0 ? "bg-black/30" : "bg-black/10"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-violet-200">
                    {appt.patient.name}
                  </td>
                  <td className="px-4 py-3">{appt.patient.contactNumber}</td>

                  {/* Health Data Button */}
                  <td className="px-4 py-3 text-center">
                    {appt.patient.patient_health_data ? (
                      <button
                        onClick={() =>
                          handleViewHealthData(appt.patient.patient_health_data)
                        }
                        className="btn btn-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
                      >
                        View Health Data
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No Health Info
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {appt.patient.medical_report.map((r: any) => (
                      <a
                        key={r.id}
                        href={r.reportLink}
                        target="_blank"
                        className="block text-violet-400 hover:text-violet-200 underline"
                      >
                        📄 {r.reportName}
                      </a>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(appt.schedule.startDateTime).toLocaleString()} –{" "}
                    {new Date(appt.schedule.endDateTime).toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      appt.paymentStatus === "PAID"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {appt.paymentStatus}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={appt.status}
                      onChange={(e) =>
                        handleStatusChange(appt.id, e.target.value)
                      }
                      className={`select select-sm rounded-lg px-2 py-1 focus:outline-none bg-black text-violet-400 border border-violet-600 ${getStatusClass(
                        appt.status
                      )}`}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="INPROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  {/* Prescription Buttons */}
                  <td className="px-4 py-3 flex flex-col gap-2">
                    <button
                      disabled={
                        appt.status !== "COMPLETED" || !!appt.prescription
                      }
                      onClick={() => handleOpenCreatePrescriptionModal(appt)}
                      className={`btn btn-sm rounded-lg w-full transition ${
                        appt.status === "COMPLETED" && !appt.prescription
                          ? "bg-green-600 hover:bg-green-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Add Prescription
                    </button>

                    <button
                      disabled={!appt.prescription}
                      onClick={() =>
                        handleOpenViewPrescriptionModal(appt.prescription)
                      }
                      className={`btn btn-sm rounded-lg w-full transition ${
                        appt.prescription
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      View Prescription
                    </button>
                  </td>

                  {/* Join Call Button Column */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        router.push(`/doctor/video-call/${appt.id}`)
                      }
                      disabled={
                        !(
                          appt.status === "SCHEDULED" ||
                          appt.status === "INPROGRESS"
                        )
                      }
                      className={`btn btn-sm rounded-lg transition w-full ${
                        appt.status === "SCHEDULED" ||
                        appt.status === "INPROGRESS"
                          ? "bg-violet-600 hover:bg-violet-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      🎥 Join Call
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`btn btn-sm px-4 py-1 rounded-lg transition ${
            page <= 1
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          Previous
        </button>

        <span className="px-4 py-1 border border-violet-600 rounded-lg text-white">
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className={`btn btn-sm px-4 py-1 rounded-lg transition ${
            page >= totalPages
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Prescription</h3>
            <textarea
              placeholder="Instructions"
              className="w-full p-2 mb-4 rounded-lg bg-gray-900 border border-violet-600"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full p-2 mb-4 rounded-lg bg-gray-900 border border-violet-600"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-sm bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePrescription}
                disabled={creating}
                className={`btn btn-sm ${
                  creating
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {showViewModal && viewPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Prescription</h3>
            <p className="mb-2">
              <span className="font-semibold">Instructions:</span>{" "}
              {viewPrescription.instructions}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Follow Up Date:</span>{" "}
              {viewPrescription.followUpDate
                ? new Date(viewPrescription.followUpDate).toLocaleString()
                : "N/A"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-sm bg-gray-700 hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Data Modal */}
      {/* Health Data Modal */}
      {showHealthModal && selectedHealthData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black text-white rounded-2xl p-6 w-full max-w-lg border border-violet-600 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-violet-400">
              Patient Health Data
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {selectedHealthData.gender}
              </p>
              <p>
                <span className="font-semibold">Date of Birth:</span>{" "}
                {new Date(selectedHealthData.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Blood Group:</span>{" "}
                {selectedHealthData.bloodGroup}
              </p>
              <p>
                <span className="font-semibold">Allergies:</span>{" "}
                {selectedHealthData.hasAllergies ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Diabetes:</span>{" "}
                {selectedHealthData.hasDiabetes ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Height:</span>{" "}
                {selectedHealthData.height}
              </p>
              <p>
                <span className="font-semibold">Weight:</span>{" "}
                {selectedHealthData.weight}
              </p>
              <p>
                <span className="font-semibold">Smoking Status:</span>{" "}
                {selectedHealthData.smokingStatus ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Dietary Preferences:</span>{" "}
                {selectedHealthData.dietaryPreferences || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Pregnancy Status:</span>{" "}
                {selectedHealthData.pregnancyStatus ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Mental Health History:</span>{" "}
                {selectedHealthData.mentalHealthHistory || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Immunization Status:</span>{" "}
                {selectedHealthData.immunizationStatus || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Past Surgeries:</span>{" "}
                {selectedHealthData.hasPastSurgeries ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Recent Anxiety:</span>{" "}
                {selectedHealthData.recentAnxiety ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Recent Depression:</span>{" "}
                {selectedHealthData.recentDepression ? "✅" : "❌"}
              </p>
              <p>
                <span className="font-semibold">Marital Status:</span>{" "}
                {selectedHealthData.maritalStatus}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
