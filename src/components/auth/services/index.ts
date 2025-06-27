"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (data: FieldValues) => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const userData = await result.json();
  console.log("User data:", userData);
  (await cookies()).set("accessToken", userData.data.accessToken);
  (await cookies()).set("refreshToken", userData.data.refreshToken);
  return userData;
};

export const forgotPassword = async (data: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await res.json();

  return result;
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedUser = null;
  if (accessToken) {
    decodedUser = jwtDecode(accessToken);
    return decodedUser;
  } else {
    return null;
  }
};

export const register = async (data: FormData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/create-patient`,
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  return result;
};
