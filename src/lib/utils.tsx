import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ExamAuthUser, ExamDetailData } from "@/context/ExamContext";
import { clsx, type ClassValue } from "clsx";
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
  return `${authUser?.api_url}/${path}`;
};

export function saveTest(
  examData: ExamDetailData,
  submitted: "Yes" | "No" = "No"
) {
  const requestBody = {
    response: { ...examData.studentExamState.student_answers },
    remaining_time: 0,
    test_id: examData._id.$oid,
    submitted: submitted,
    webtesttoken: examData.authUser?.webtesttoken,
    start_date: examData.studentExamState.start_date,
  };
  return fetch(`${examData.authUser?.api_url}/save-test-response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).catch(() => {
    showSaveTestError(() => saveTest(examData), examData);
  });
}

export const showSaveTestError = (
  callback: (payload: any) => void,
  payload: ExamDetailData
) => {
  toast({
    variant: "destructive",
    title: "We were unable to save answers",
    action: (
      <ToastAction altText="Try again" onClick={() => callback(payload)}>
        Try again
      </ToastAction>
    ),
  });
};
