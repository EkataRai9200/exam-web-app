import { ExamDetailData } from "@/context/ExamContext";

let worker: Worker | null = null;
let isStarted = false;
let listeners: ((data: TimerWorkerResponse) => void)[] = [];

type TimerWorkerCommand =
  | { command: "start"; data: { duration: number } }
  | { command: "stop" };

type TimerWorkerResponse =
  | { type: "tick"; remaining: number }
  | { type: "finished" };

export function startTimer(duration: number): void {
  if (!worker) {
    worker = new Worker(new URL("/timerWorker.js", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (event: MessageEvent<TimerWorkerResponse>) => {
      listeners.forEach((cb) => cb(event.data));
    };
  }

  if (!isStarted) {
    const message: TimerWorkerCommand = {
      command: "start",
      data: { duration },
    };
    worker.postMessage(message);
    isStarted = true;
  }
}

export function onTick(callback: (data: TimerWorkerResponse) => void): void {
  listeners.push(callback);
}

export function stopTimer(): void {
  if (worker) {
    const message: TimerWorkerCommand = { command: "stop" };
    worker.postMessage(message);
    worker.terminate();
    worker = null;
    isStarted = false;
    listeners = [];
  }
}

export function getAvailableExamTime(examData: ExamDetailData) {
  let endTimeLeft = Number.MAX_SAFE_INTEGER;
  if (examData.test_end_date) {
    endTimeLeft = examData.test_end_date - Date.now();
    if (endTimeLeft < 0) return 0;
  }

  const timeLeft = Math.min(
    parseFloat(examData.test_time_limit) * 60 - (examData.elapsed_time ?? 0),
    endTimeLeft
  );
  return timeLeft;
}

export function getAvailableSubjectTime(examData: ExamDetailData) {
  let endTimeLeft = Number.MAX_SAFE_INTEGER;
  if (examData.test_end_date) {
    endTimeLeft = Math.floor((examData.test_end_date - Date.now()) / 1000);
    if (endTimeLeft < 0) return 0;
  }
  const subject = examData.subjects[examData.studentExamState.activeSubject];
  const timeObj = examData.subject_times
    ? examData.subject_times[subject.sub_id]
    : { elapsed_time: 0 };

  // TODO: Fix this: campare total time of all subjects with end time instead of single subject time
  const timeLeft = Math.min(
    parseFloat(subject.subject_time) * 60 - (timeObj?.elapsed_time ?? 0),
    endTimeLeft
  );
  return timeLeft;
}
