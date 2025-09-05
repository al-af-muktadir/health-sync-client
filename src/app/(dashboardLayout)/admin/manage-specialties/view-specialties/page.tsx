"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getSpecialties } from "@/components/auth/services/adminServices";

type Disease = {
  id: string;
  name: string;
};

type Specialty = {
  id: string;
  title: string;
  icon: string;
  diseases: Disease[];
};

const ViewSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    try {
      const res = await getSpecialties();
      console.log("Fetched Specialties:", res.data);
      setSpecialties(res?.data || []);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const toggleRow = (id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-violet-400 mb-6 text-center">
        Specialties and Diseases
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-violet-800 text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Icon</th>
              <th className="p-4 text-left">Specialty</th>
              <th className="p-4 text-left">Diseases</th>
            </tr>
          </thead>
          <tbody>
            {specialties.map((spec, index) => (
              <>
                <tr
                  key={spec.id}
                  className="bg-gray-900 border-b border-gray-700"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <img
                      src={spec.icon}
                      alt={spec.title}
                      className="w-10 h-10 rounded-full border border-violet-500"
                    />
                  </td>
                  <td className="p-4 font-semibold">{spec.title}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleRow(spec.id)}
                      className="text-violet-400 hover:text-violet-200 transition-all flex items-center gap-1"
                    >
                      {openRow === spec.id ? (
                        <>
                          Hide <ChevronUp size={18} />
                        </>
                      ) : (
                        <>
                          View <ChevronDown size={18} />
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {openRow === spec.id && (
                  <tr className="bg-gray-800">
                    <td colSpan={4} className="p-4">
                      {spec.diseases.length > 0 ? (
                        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-violet-300 list-disc pl-5">
                          {spec.diseases.map((disease) => (
                            <li key={disease.id}>{disease.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No diseases listed.</p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSpecialties;
