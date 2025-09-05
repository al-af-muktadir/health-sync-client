/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";

import logo from "../../../../../public/Animation - 1749834497886.json";
import {
  bookAppointment,
  getDoctorById,
  getScheduleById,
  PaymentInitiate,
} from "@/components/auth/services/doctorServices";
import { toast, Toaster } from "sonner";

interface Schedule {
  id: string; // schedule record id
  scheduleId: string;
  doctorId: string;
  isBooked: boolean;
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

interface Doctor {
  id: string;
  name: string;
  profilePhoto?: string;
  designation: string;
  specialty: { id: string; title: string };
  experience: number;
  appointmentFee: number;
  contactNumber: string;
  currentWorkingPlace: string;
  qualification: string;
  registrationNumber: string;
  email: string;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  console.log(selectedSchedule);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorRes = await getDoctorById(doctorId);
        setDoctor(doctorRes.data);

        const scheduleRes = await getScheduleById(doctorId);
        setSchedules(scheduleRes.data);
        console.log(scheduleRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleBookSchedule = async (docId: any, schedduleId: any) => {
    if (!selectedSchedule) return alert("Select a schedule first!");
    setBooking(true);
    try {
      const data = {
        doctorId: docId,
        scheduleId: schedduleId,
      };
      console.log(data);
      const res = await bookAppointment(data);
      console.log("Appointment BOkked", res);
      if (res.success) {
        toast.success("Appointment Booked Successfully");

        const paymentRes = await PaymentInitiate(res.data.id);
        console.log(paymentRes);
        if (paymentRes?.data.paymentUrl) {
          window.location.href = paymentRes?.data.paymentUrl;
        } else {
          toast.error("Failed to get payment link");
        }

        const scheduleRes = await getScheduleById(doctorId);
        setSchedules(scheduleRes.data);
        setSelectedSchedule(null);
      }
    } catch (err) {
      toast.error("Could Booked Appointment");
      console.error(err);
      alert("Failed to book schedule.");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie className="w-32" animationData={logo} loop />
      </div>
    );

  if (!doctor)
    return <p className="text-center text-white mt-20">Doctor not found.</p>;

  return (
    <div className="min-h-screen bg-black p-8 text-white max-w-4xl mx-auto">
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-6 bg-gray-900 rounded-xl p-6 shadow-lg">
        <div className="w-full sm:w-1/3 h-64 relative">
          <Image
            src={doctor.profilePhoto || "/default-doctor.png"}
            alt={doctor.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p>{doctor.designation}</p>
          <p className="font-semibold text-violet-400">
            {doctor.specialty.title}
          </p>
          <p>Experience: {doctor.experience} yrs</p>
          <p>Qualification: {doctor.qualification}</p>
          <p>Registration #: {doctor.registrationNumber}</p>
          <p>Appointment Fee: ${doctor.appointmentFee}</p>
          <p>Working at: {doctor.currentWorkingPlace}</p>
          <p>Email: {doctor.email}</p>
        </div>
      </div>

      {/* Schedule Selection */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Select a Schedule</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {schedules.map((s) => {
            const start = new Date(s.schedule.startDateTime).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            );
            const end = new Date(s.schedule.endDateTime).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            );
            return (
              <button
                key={s.id}
                disabled={s.isBooked}
                onClick={() => setSelectedSchedule(s.scheduleId)}
                className={`px-4 py-2 rounded-lg font-semibold border transition-all ${
                  selectedSchedule === s.id
                    ? "bg-violet-600 border-violet-400"
                    : "bg-gray-800 border-gray-600"
                } ${
                  s.isBooked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-violet-500"
                }`}
              >
                {start} - {end} {s.isBooked && "(Booked)"}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => handleBookSchedule(doctorId, selectedSchedule)}
          disabled={!selectedSchedule || booking}
          className="mt-6 w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 font-semibold text-white shadow-md disabled:opacity-50 hover:from-violet-700 hover:to-pink-700 transition-all"
        >
          {booking ? "Booking..." : "Book Appointment"}
        </button>
      </div>
      <Toaster />
    </div>
  );
}
