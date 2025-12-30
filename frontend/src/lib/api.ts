import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // important if backend sets cookies
});


export async function fetchHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/health`);
  if (!res.ok) {
    throw new Error("Failed to fetch health");
  }
  return res.json();
}
