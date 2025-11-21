import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// default tailwind classname merge helper function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert date objects into ISO format string("2025-11-14")
export const formatISODate = (d: Date) => d.toISOString().split("T")[0];
