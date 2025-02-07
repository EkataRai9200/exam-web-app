import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ExamAuthUser, ExamDetailData } from "@/context/ExamContext";
import { clsx, type ClassValue } from "clsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

// src/utils/formatTime.ts
export const formatTimeToJSON = (
  seconds: number
): { h: string; m: string; s: string } => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    h: `${h < 10 ? "0" : ""}${h}`,
    m: `${m < 10 ? "0" : ""}${m}`,
    s: `${s < 10 ? "0" : ""}${s}`,
  };
};

export const liveTestApiURL = (authUser: ExamAuthUser, path: string) => {
  return `${authUser?.api_url}/${path}`;
};

export const openFullscreen = () => {
  const elem = document.documentElement as any;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
};

export function saveTest(
  examData: ExamDetailData,
  submitted: "Yes" | "No" = "No"
) {
  const MySwal = withReactContent(Swal);
  const requestBody: any = {
    response: { ...examData.studentExamState.student_answers },
    remaining_time: 0,
    test_id: examData._id.$oid,
    submitted: submitted,
    webtesttoken: examData.authUser?.webtesttoken,
    start_date: examData.studentExamState.start_date,
    subject_times: examData.studentExamState.subject_times,
    timeSpent: examData.studentExamState.timeSpent,
  };
  if (examData.studentExamState.submission_source) {
    requestBody.submission_source = examData.studentExamState.submission_source;
  }
  return fetch(`${examData.authUser?.api_url}/save-test-response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(async (res: any) => {
      const response = await res.json();
      if (!response.status) {
        MySwal.fire({
          title: "Session Expired, Start test again to continue.",
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          backdrop: "rgba(0, 0, 0, 0.5)",
          confirmButtonText: "Start Test",
        }).then((_result) => {
          if (_result.isConfirmed) {
            window.location.reload();
          }
        });
      }
      return response;
    })
    .catch(() => {
      showSaveTestError(() => saveTest(examData, submitted), examData);
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
export const sanitize = (string: string) => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
};

export const calcSubjectRemTime = (start_time: number, time_limit: number) => {
  const end_time = start_time + time_limit * 1000;
  return Math.floor(Math.max(0, end_time - Date.now()) / 1000);
};

export function requestFullScreen() {
  let element = window.document.documentElement as any;
  // Supports most browsers and their versions.
  let requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof (window as any).ActiveXObject !== "undefined") {
    // Older IE.
    let wscript = new (window as any).ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export const getBrowserInfo = () => {
  let nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = "" + parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let nameOffset, verOffset, ix;

  // In Opera, the true version is after "OPR" or after "Version"
  if ((verOffset = nAgt.indexOf("OPR")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 4);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MS Edge, the true version is after "Edg" in userAgent
  else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
    browserName = "Microsoft Edge";
    fullVersion = nAgt.substring(verOffset + 4);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  return {
    browserName,
    fullVersion,
    majorVersion,
    appName: navigator.appName,
    userAgent: navigator.userAgent,
  };
};
