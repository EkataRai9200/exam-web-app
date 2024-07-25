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
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number>(startTime + initialSeconds * 1000);

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
      <p className="flex items-center w-full md:w-auto bg-gray-100 md:bg-white rounded-sm md:rounded-md p-1 md:p-2 gap-2 text-sm">
        <Timer size={20} />
        {beforeText && (
          <span className="font-medium text-sm">{beforeText}</span>
        )}
        <span className="font-medium rounded-md w-6 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).h}
        </span>
        <span className="font-medium rounded-md w-6 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).m}
        </span>
        <span className="font-medium rounded-md w-6 h-6 flex items-center justify-center bg-gray-300">
          {formatTimeToJSON(timeLeft).s}
        </span>
      </p>
    </>
  );
};

export default CountdownTimer;
