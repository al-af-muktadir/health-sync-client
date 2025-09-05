/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";

interface ScheduleQueryParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getSchedules = async (params?: ScheduleQueryParams) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
  }

  const result = await fetch(
    `http://localhost:5000/api/v1/schedules?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );

  const data = await result.json();
  return data;
};
export const saveSchedules = async (data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/doctor-schedule`, {
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
export const fetchMyBlogs = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/blog/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
export const getDoctorById = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/doctor/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};

export const mySchedules = async ({
  page = 1,
  limit = 5,
  startDate,
  endDate,
  isBooked,
}: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  isBooked?: boolean;
}) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically
  const query = new URLSearchParams();

  if (page) query.append("page", String(page));
  if (limit) query.append("limit", String(limit));
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);
  if (isBooked !== undefined) query.append("isBooked", String(isBooked));

  const res = await fetch(
    `http://localhost:5000/api/v1/doctor-schedule/me?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    }
  );

  const result = await res.json();
  return result;
};

export const DeleteSchedules = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/doctor-schedule/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token ? `${token}` : "",
      },
    }
  );

  const result = await res.json();
  return result;
};

export const getAllDoctors = async ({
  page = 1,
  limit = 6,
  searchTerm,
  gender,
  email,
  contactNumber,
  appointmentFee,
  specialties,
  sortBy,
  sortOrder,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  gender?: string;
  email?: string;
  contactNumber?: string;
  appointmentFee?: number;
  specialties?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const token = (await cookies()).get("accessToken")?.value;

  const query = new URLSearchParams();

  query.append("page", String(page));
  query.append("limit", String(limit));
  if (searchTerm) query.append("searchTerm", searchTerm);
  if (gender) query.append("gender", gender);
  if (email) query.append("email", email);
  if (contactNumber) query.append("contactNumber", contactNumber);
  if (appointmentFee) query.append("appointmentFee", String(appointmentFee));
  if (specialties) query.append("specialties", specialties);
  if (sortBy) query.append("sortBy", sortBy);
  if (sortOrder) query.append("sortOrder", sortOrder);

  const res = await fetch(
    `http://localhost:5000/api/v1/doctor?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
      cache: "no-store", // always fresh
    }
  );

  return res.json(); // will contain {meta, data}
};
export const getScheduleById = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(
    `http://localhost:5000/api/v1/doctor-schedule/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `${token}` : "",
      },
    }
  );

  const result = await res.json();
  return result;
};
export const bookAppointment = async (data: any) => {
  const token = (await cookies()).get("accessToken")?.value;
  console.log(token, data, "INSERVERFUNC");
  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/appointment`, {
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
export const createBlogs = async (formData: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/blog`, {
    method: "POST",
    headers: {
      Authorization: token ? `${token}` : "",
    },
    body: formData,
  });

  const result = await res.json();
  return result;
};
export const fetchALlBloggggg = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/blog`, {
    method: "GET",
    headers: {
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
export const deleteBlogs = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
export const updateBlogs = async (id: any, data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically

  const res = await fetch(`http://localhost:5000/api/v1/blog/${id}`, {
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
export const PaymentInitiate = async (id: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically
  console.log("aId", id);

  const res = await fetch(
    `http://localhost:5000/api/v1/payment/init-payment/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
    }
  );

  const result = await res.json();
  return result;
};
export const UpdateStatus = async (id: any, status: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // Build query string dynamically
  console.log("aId", id);

  const res = await fetch(
    `http://localhost:5000/api/v1/appointment/status/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
      body: JSON.stringify(status),
    }
  );

  const result = await res.json();
  return result;
};
export const createPrescription = async (id: any, data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(
    `http://localhost:5000/api/v1/appointment/prescription/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  return result;
};
export const fetchDoctorDashboard = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/diagnosis/my-stats`, {
    method: "GET",
    headers: {
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
export const fetchAllBlog = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/blog`, {
    method: "GET",
    headers: {
      Authorization: token ? `${token}` : "",
    },
  });

  const result = await res.json();
  return result;
};
export const updatePublish = async (id: any, isPublished: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  const res = await fetch(`http://localhost:5000/api/v1/blog/publish/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `${token}` : "",
    },
    body: JSON.stringify(isPublished),
  });

  const result = await res.json();
  return result;
};

export const getPublishedBlogs = async () => {
  const res = await fetch(
    `http://localhost:5000/api/v1/blog?isPublished=true`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.data || [];
};

export async function fetchBlogById(id: string) {
  const res = await fetch(`http://localhost:5000/api/v1/blog/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  const data = await res.json();
  return data.data;
}
