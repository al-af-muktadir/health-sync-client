/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";

export const getme = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  const result = await fetch("http://localhost:5000/api/v1/user/get-user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });
  const data = await result.json();
  return data;
};
export const getDoctorsByDiseaseName = async (diseaseName: string) => {
  const res = await fetch(
    `http://localhost:5000/api/v1/diagnosis/${diseaseName}/doctors`,
    {
      method: "GET",
    }
  );

  const data = await res.json();
  return data;
};

export const createDoctor = async (data: any) => {
  const res = await fetch(`http://localhost:5000/api/v1/user/create-doctor`, {
    method: "POST",
    body: data,
  });
  const result = await res.json();

  return result;
};
export const fetchSpecialties = async () => {
  const res = await fetch(`http://localhost:5000/api/v1/specialties`);
  const result = await res.json();

  return result;
};

export const fetchAppointment = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/appointment/txnId/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );
  const result = await res.json();
  return result;
};
export const fetchNotificationyyy = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/payment/notificationsss`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );
  const result = await res.json();
  return result;
};

export interface FetchAppointmentsQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  paymentStatus?: string;
  searchTerm?: string;
}

export const fetchMyAppointments = async (
  query: FetchAppointmentsQuery = {}
) => {
  const token = (await cookies()).get("accessToken")?.value;

  const queryString = new URLSearchParams(
    Object.entries(query).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  ).toString();

  const res = await fetch(
    `http://localhost:5000/api/v1/appointment/my-appointment?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );

  const result = await res.json();
  return result;
};

export const generateRoom = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/appointment/${id}/video-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );
  const result = await res.json();
  return result;
};
export const getMyHealth = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/patient/me/health`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });
  const result = await res.json();
  return result;
};
export const updateHealth = async (data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/patient/me/health`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};
export const getMyReports = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/medical/my-report`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });
  const result = await res.json();
  return result;
};
export const PostMyReports = async (data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/medical`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};
interface FetchMyPaymentsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchMyPayments = async (options: FetchMyPaymentsOptions = {}) => {
  const token = (await cookies()).get("accessToken")?.value;

  const params = new URLSearchParams();
  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.search) params.append("search", options.search);

  const res = await fetch(
    `http://localhost:5000/api/v1/payment/my-payments?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch payments");
  }

  return res.json();
};
export const deleteReport = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/medical/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });
  const result = await res.json();
  return result;
};
export const getMyStats = async (email: any) => {
  // const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/patient/stats/${email}`,
    {
      method: "GET",
    }
  );
  const result = await res.json();
  return result;
};
