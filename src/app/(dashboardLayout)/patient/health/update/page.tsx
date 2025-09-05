/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  getMyHealth,
  updateHealth,
} from "@/components/auth/services/userService";
import logo from "../../../../../../public/Animation - 1749834497886.json";
import Lottie from "lottie-react";

// Define HealthData interface
interface HealthData {
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  bloodGroup: string;
  height: string;
  weight: string;
  maritalStatus: "MARRIED" | "UNMARRIED";

  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
}

// Empty/default health data
const emptyHealthData: HealthData = {
  gender: "MALE",
  dateOfBirth: "",
  bloodGroup: "A_POSITIVE",
  height: "",
  weight: "",
  maritalStatus: "UNMARRIED",
  hasAllergies: false,
  hasDiabetes: false,
  smokingStatus: false,
  dietaryPreferences: "",
  pregnancyStatus: false,
  mentalHealthHistory: "",
  immunizationStatus: "",
  hasPastSurgeries: false,
  recentAnxiety: false,
  recentDepression: false,
};

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData>(emptyHealthData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await getMyHealth();
        if (res.success && res.data) {
          setHealthData({ ...emptyHealthData, ...res.data });
          toast.success("Information fetched successfully");
        } else {
          toast("No previous data found, fill the form");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  // Properly typed handleChange function
  const handleChange = <K extends keyof HealthData>(
    field: K,
    value: HealthData[K]
  ) => {
    setHealthData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await updateHealth(healthData);
      if (res.success) {
        toast.success("Information updated successfully");
      } else {
        toast.error("Failed to update information");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Gender */}
        <label className="flex flex-col">
          Gender
          <select
            className="input bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.gender}
            onChange={(e) =>
              handleChange("gender", e.target.value as "MALE" | "FEMALE")
            }
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </label>

        {/* Date of Birth */}
        <label className="flex flex-col">
          Date of Birth
          <Input
            type="date"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.dateOfBirth.slice(0, 10)}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </label>

        {/* Blood Group */}
        <label className="flex flex-col">
          Blood Group
          <select
            className="input bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.bloodGroup}
            onChange={(e) =>
              handleChange(
                "bloodGroup",
                e.target.value as HealthData["bloodGroup"]
              )
            }
          >
            <option value="A_POSITIVE">A+</option>
            <option value="B_POSITIVE">B+</option>
            <option value="O_POSITIVE">O+</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="A_NEGETIVE">A-</option>
            <option value="B_NEGETIVE">B-</option>
            <option value="O_NEGETIVE">O-</option>
            <option value="AB_NEGETIVE">AB-</option>
          </select>
        </label>

        {/* Height */}
        <label className="flex flex-col">
          Height
          <Input
            type="text"
            placeholder="Height"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.height}
            onChange={(e) => handleChange("height", e.target.value)}
          />
        </label>

        {/* Weight */}
        <label className="flex flex-col">
          Weight
          <Input
            type="text"
            placeholder="Weight"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
          />
        </label>

        {/* Marital Status */}
        <label className="flex flex-col">
          Marital Status
          <select
            className="input bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.maritalStatus}
            onChange={(e) =>
              handleChange(
                "maritalStatus",
                e.target.value as "MARRIED" | "UNMARRIED"
              )
            }
          >
            <option value="MARRIED">Married</option>
            <option value="UNMARRIED">Unmarried</option>
          </select>
        </label>

        {/* Checkbox Fields */}
        {[
          { field: "hasAllergies", label: "Has Allergies" },
          { field: "hasDiabetes", label: "Has Diabetes" },
          { field: "smokingStatus", label: "Smoking" },
          { field: "pregnancyStatus", label: "Pregnancy" },
          { field: "hasPastSurgeries", label: "Past Surgeries" },
          { field: "recentAnxiety", label: "Recent Anxiety" },
          { field: "recentDepression", label: "Recent Depression" },
        ].map((item) => {
          const value = healthData[item.field as keyof HealthData] as
            | boolean
            | undefined;
          return (
            <label key={item.field} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value ?? false}
                onChange={(e) =>
                  handleChange(item.field as any, e.target.checked)
                }
              />
              {item.label}
            </label>
          );
        })}

        <label className="flex flex-col col-span-full">
          Dietary Preferences
          <Input
            type="text"
            placeholder="Dietary Preferences"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.dietaryPreferences || ""}
            onChange={(e) => handleChange("dietaryPreferences", e.target.value)}
          />
        </label>

        {/* Mental Health History */}
        <label className="flex flex-col col-span-full">
          Mental Health History
          <Input
            type="text"
            placeholder="Mental Health History"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.mentalHealthHistory || ""}
            onChange={(e) =>
              handleChange("mentalHealthHistory", e.target.value)
            }
          />
        </label>

        {/* Immunization Status */}
        <label className="flex flex-col col-span-full">
          Immunization Status
          <Input
            type="text"
            placeholder="Immunization Status"
            className="bg-black text-white border border-violet-600 rounded-xl mt-1"
            value={healthData.immunizationStatus || ""}
            onChange={(e) => handleChange("immunizationStatus", e.target.value)}
          />
        </label>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitting}
          className={`mt-6 col-span-full ${
            submitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700"
          }`}
        >
          {submitting
            ? "Updating..."
            : healthData.dateOfBirth
            ? "Update Health Information"
            : "Save Health Information"}
        </Button>
      </form>

      <Toaster />
    </div>
  );
}
