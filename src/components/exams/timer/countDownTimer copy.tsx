import { useExamData } from "@/lib/hooks";
import { formatTimeToJSON } from "@/lib/utils";
import { Timer } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  startTime: number;
  initialSeconds: number;
  onStart?: () => void;
  onExpire?: () => void;
  beforeText?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onStart,
  onExpire,
  startTime,
  beforeText,
}) => {
  const {
    examData: { test_end_date },
  } = useExamData();

  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // check if test_end_date is less than
  const endTimeRef = useRef<number>(
    test_end_date && test_end_date < startTime + initialSeconds * 1000
      ? test_end_date
      : startTime + initialSeconds * 1000
  );

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTimeRef.current - now);
      if (timeLeft / 1000 <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          onExpire && onExpire();
        }
      }
      setTimeLeft(Math.floor(timeLeft / 1000));
    };

    intervalRef.current = setInterval(updateRemainingTime, 1000);
    onStart && onStart();
    updateRemainingTime();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <p className="flex items-center w-full md:w-auto bg-gray-100  rounded-sm p-1 md:p-2 gap-2 text-sm">
        <Timer size={20} />
        {beforeText && (
          <span className="font-medium text-sm">{beforeText}</span>
        )}
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).h}
        </span>
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).m}
        </span>
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).s}
        </span>
      </p>
    </>
  );
};

export default CountdownTimer;
