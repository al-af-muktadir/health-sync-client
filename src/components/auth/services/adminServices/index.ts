"use server";
import { cookies } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createSchedule = async (data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};

export const fetchPatients = async ({ page }: { page: any }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/patient?page=${page}`
  );
  const result = await res.json();
  return result;
};

export const updatePatientStatus = async (
  email: string,
  status: "ACTIVE" | "BLOCK"
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/patient/update-status/${email}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await res.json();
  return result;
};
export const deletePatientData = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/patient/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();
  return result;
};

export const createSpecialty = async (formData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/specialties`, {
    method: "POST",
    body: formData,
  });
  const result = await res.json();
  return result;
};
export const getSpecialties = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/specialties`, {
    method: "GET",
  });
  const result = await res.json();
  return result;
};

export const fetchDiseasesBySpecialty = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/diagnosis/grouped-by-specialty`,
    {
      method: "GET",
    }
  );
  const result = await res.json();
  return result;
};
export const updateDiseaseData = async (id: any, data: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/diagnosis/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await res.json();
  return result;
};

export const getAdminDashboard = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`NEXT_PUBLIC_BASE_URL/user/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
