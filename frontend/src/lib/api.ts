"use client";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchHealth() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/health`,
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch health");
  }

  return res.json();
}
