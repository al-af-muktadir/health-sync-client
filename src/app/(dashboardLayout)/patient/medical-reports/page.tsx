"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/api/Context/UserContext";
import {
  deleteReport,
  getMyReports,
  PostMyReports,
} from "@/components/auth/services/userService";
import { toast, Toaster } from "sonner";

interface MedicalReport {
  id: string;
  reportName: string;
  reportLink: string;
  createdAt: string;
}

export default function MedicalReportPage() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [reportName, setReportName] = useState("");
  const [reportLink, setReportLink] = useState("");
  const { user } = useUser();

  const fetchReports = async () => {
    const res = await getMyReports();
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAdd = async () => {
    if (!reportName || !reportLink) {
      toast.error("Please fill all fields");
      return;
    }
    const obj = { reportName, reportLink };
    const res = await PostMyReports(obj);
    console.log(res);
    if (res.success) {
      toast.success("Report Added Successfully");
      setReportName("");
      setReportLink("");
      fetchReports();
    } else {
      toast.error("Please Try Again");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteReport(id);
    if (res.success) {
      toast.success("Deleted Successfully");
      fetchReports();
    } else {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-violet-400 mb-6">
        Medical Reports
      </h1>

      {/* Add Report Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Report Name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Upload Your File's Google Drive Link"
          value={reportLink}
          onChange={(e) => setReportLink(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full md:w-1/3"
        />
        <Button
          onClick={handleAdd}
          className="bg-violet-600 hover:bg-violet-700 w-full md:w-auto"
        >
          Add Report
        </Button>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left border border-violet-700">
          <thead className="bg-violet-900 text-violet-300 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Report Name</th>
              <th className="px-6 py-3 text-left">Link</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr
                key={r.id}
                className="border-b border-violet-700 hover:bg-violet-950"
              >
                <td className="px-6 py-3">{r.reportName}</td>
                <td className="px-6 py-3">
                  <a
                    href={r.reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    View
                  </a>
                </td>
                <td className="px-6 py-3">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-3 text-center">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toaster />
    </div>
  );
}
