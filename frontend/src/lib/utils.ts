import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// default tailwind classname merge helper function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert date objects into ISO format string("2025-11-14")
export const formatISODate = (d: Date) => d.toISOString().split("T")[0];

// Helper function to convert date objects into Python-friendly ISO format string("2025-11-14T00:00:00+00:00")
export const formatPythonISODate = (d: Date) =>
  d.toISOString().replace("Z", "+00:00");

// Helper to produce an URL-encoded ISO datetime (e.g. "2025-11-11T21%3A51%3A07.209Z")
export const formatISOForQuery = (d: Date) =>
  encodeURIComponent(d.toISOString());
