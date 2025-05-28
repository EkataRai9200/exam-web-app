import { useExamData } from "@/lib/hooks";
import { useRef, useState } from "react";
import { onTick, startTimer, stopTimer } from "./timerWorkerManager";

type TimerResponse = {
  type: "tick" | "finished";
  remaining?: number;
};

export function useTimerManager() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const listenerRef = useRef<(data: TimerResponse) => void>();

  const { onTimerExpires } = useExamData();

  const start = (duration: number) => {
    stop(); // clear previous
    startTimer(duration);
    listenerRef.current = (data) => {
      if (data.type === "tick" && data.remaining != null) {
        const remaining = data.remaining;
        setRemaining(remaining ?? 0);
      } else if (data.type === "finished") {
        onTimerExpires();
        setRemaining(0);
      }
    };

    onTick(listenerRef.current);
  };

  const stop = () => {
    stopTimer();
    setRemaining(null);
  };

  return { remaining, start, stop };
}
