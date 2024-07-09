import { ExamAuthUser } from "@/context/ExamContext";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/formatTime.ts
export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

export const liveTestApiURL = (authUser: ExamAuthUser, path: string) => {
  return `http://${authUser?.institute_url}/livetest/${path}`;
};
