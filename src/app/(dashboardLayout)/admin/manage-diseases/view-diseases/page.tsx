"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  fetchDiseasesBySpecialty,
  updateDiseaseData,
} from "@/components/auth/services/adminServices";

interface Disease {
  id: string;
  name: string;
  description: string;
  precautions: string[];
  specialty: {
    id: string;
    title: string;
  };
}

const DiseaseManagementPage = () => {
  const [originalDiseases, setOriginalDiseases] = useState<Disease[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [precautions, setPrecautions] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDiseases = async () => {
      const res = await fetchDiseasesBySpecialty();
      const allDiseases = res.data || [];
      console.log("Fetched Diseases:", allDiseases);
      setOriginalDiseases(allDiseases); // backup
      setDiseases(allDiseases); // working copy
    };
    fetchDiseases();
  }, []);

  // Filter diseases
  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = originalDiseases.filter(
      (d) =>
        d.name.toLowerCase().includes(lower) ||
        d.specialty.title.toLowerCase().includes(lower)
    );
    setDiseases(filtered);
  }, [search, originalDiseases]);

  const openViewModal = (disease: Disease) => {
    setSelectedDisease(disease);
    setEditMode(false);
  };

  const openEditModal = (disease: Disease) => {
    setSelectedDisease(disease);
    setDescription(disease.description);
    setPrecautions(disease.precautions.join(", "));
    setEditMode(true);
  };

  const handleUpdate = async (id: string) => {
    if (!selectedDisease) return;
    const updated = {
      description,
      precautions: precautions.split(",").map((p) => p.trim()),
    };
    console.log("Updating disease:", id, updated);
    const res = await updateDiseaseData(id, updated);
    console.log("Updated disease:", res);

    // Update both originalDiseases and diseases state
    const updateFn = (arr: Disease[]) =>
      arr.map((d) =>
        d.id === id
          ? { ...d, description, precautions: updated.precautions }
          : d
      );

    setOriginalDiseases((prev) => updateFn(prev));
    setDiseases((prev) => updateFn(prev));
    setSelectedDisease(null);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-white p-8">
      <h1 className="text-4xl font-extrabold text-violet-400 mb-8 text-center tracking-wide">
        Disease Management
      </h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by disease or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md bg-zinc-900 border border-violet-600 placeholder:text-zinc-500 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-violet-700 shadow-lg max-w-5xl mx-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-violet-900 text-violet-200 uppercase tracking-wide">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">
                Disease Name
              </th>
              <th className="p-4 text-left text-sm font-semibold">Specialty</th>
              <th className="p-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {diseases.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-zinc-400 italic select-none"
                >
                  No diseases found.
                </td>
              </tr>
            ) : (
              diseases.map((disease) => (
                <tr
                  key={disease.id}
                  className="border-t border-violet-700 hover:bg-violet-800 transition cursor-pointer"
                >
                  <td className="p-4 text-violet-100 font-medium">
                    {disease.name}
                  </td>
                  <td className="p-4 text-violet-300">
                    {disease.specialty.title}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openViewModal(disease)}
                      className="bg-violet-700 hover:bg-violet-600 px-4 py-2 rounded-md text-sm font-semibold transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(disease)}
                      className="bg-violet-700 hover:bg-violet-600 px-4 py-2 rounded-md text-sm font-semibold transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedDisease && !editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative text-white">
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-3 right-3 text-violet-400 hover:text-violet-600 transition"
              aria-label="Close view modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-violet-400">
              {selectedDisease.name}
            </h2>
            <p className="mb-4">
              <span className="font-semibold text-violet-300">
                Description:
              </span>{" "}
              {selectedDisease.description || (
                <span className="italic text-zinc-500">No description</span>
              )}
            </p>
            <div>
              <span className="font-semibold text-violet-300">
                Precautions:
              </span>
              {selectedDisease.precautions.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-violet-200">
                  {selectedDisease.precautions.map((precaution, idx) => (
                    <li key={idx}>{precaution}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-zinc-500 mt-1">
                  No precautions listed
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedDisease && editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative text-white">
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-3 right-3 text-violet-400 hover:text-violet-600 transition"
              aria-label="Close edit modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-violet-400">
              Edit: {selectedDisease.name}
            </h2>

            <label className="block mb-2 font-semibold text-violet-300">
              Description
            </label>
            <textarea
              className="w-full rounded-md bg-zinc-800 border border-violet-600 text-white p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter disease description..."
            />

            <label className="block mb-2 font-semibold text-violet-300">
              Precautions (comma separated)
            </label>
            <textarea
              className="w-full rounded-md bg-zinc-800 border border-violet-600 text-white p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              value={precautions}
              onChange={(e) => setPrecautions(e.target.value)}
              rows={3}
              placeholder="e.g., wash hands, avoid contact"
            />

            <button
              onClick={() => handleUpdate(selectedDisease.id)}
              className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-md font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseManagementPage;
