/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { getMyHealth } from "@/components/auth/services/userService";
import Lottie from "lottie-react";
import logo from "../../../../../../public/Animation - 1749834497886.json";

interface HealthData {
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  bloodGroup: string;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus: "MARRIED" | "UNMARRIED";
}

export default function ViewHealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await getMyHealth();
        if (res.success && res.data) {
          setHealthData(res.data);
        } else {
          setHealthData(null);
          toast("No health information available. Please update.");
        }
      } catch (err: any) {
        toast.error("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie className="w-32" animationData={logo} loop />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-violet-400">
        My Health Information
      </h1>

      {healthData ? (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-violet-600 w-full">
            <tbody>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Gender</td>
                <td className="p-2">{healthData.gender}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Date of Birth</td>
                <td className="p-2">{healthData.dateOfBirth.slice(0, 10)}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Blood Group</td>
                <td className="p-2">{healthData.bloodGroup}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Height</td>
                <td className="p-2">{healthData.height}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Weight</td>
                <td className="p-2">{healthData.weight}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Marital Status</td>
                <td className="p-2">{healthData.maritalStatus}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Has Allergies</td>
                <td className="p-2">
                  {healthData.hasAllergies ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Has Diabetes</td>
                <td className="p-2">{healthData.hasDiabetes ? "Yes" : "No"}</td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Smoking Status</td>
                <td className="p-2">
                  {healthData.smokingStatus ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Pregnancy Status</td>
                <td className="p-2">
                  {healthData.pregnancyStatus ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Past Surgeries</td>
                <td className="p-2">
                  {healthData.hasPastSurgeries ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Recent Anxiety</td>
                <td className="p-2">
                  {healthData.recentAnxiety ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Recent Depression</td>
                <td className="p-2">
                  {healthData.recentDepression ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Dietary Preferences</td>
                <td className="p-2">
                  {healthData.dietaryPreferences || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Mental Health History</td>
                <td className="p-2">
                  {healthData.mentalHealthHistory || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-violet-600">
                <td className="p-2 font-semibold">Immunization Status</td>
                <td className="p-2">
                  {healthData.immunizationStatus || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-400 mb-4">No health information available.</p>
      )}

      <Button
        className="mt-6 bg-violet-600 hover:bg-violet-700"
        onClick={() => router.push("/patient/health/update")}
      >
        Update Health Information
      </Button>

      <Toaster />
    </div>
  );
}
