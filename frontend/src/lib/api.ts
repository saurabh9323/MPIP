"use client";

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

const FASTAPI_URL =
  process.env.NEXT_PUBLIC_FASTAPI_URL?.trim();

// if (!API_BASE_URL) {
//   throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
// }

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// export async function fetchHealth() {
//   if (!FASTAPI_URL) {
//     throw new Error("NEXT_PUBLIC_FASTAPI_URL is missing");
//   }

//   const res = await fetch(`${FASTAPI_URL}/health`, {
//     credentials: "include",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch health");
//   }

//   return res.json();
// }
