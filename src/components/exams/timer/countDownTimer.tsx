import { formatTime } from "@/lib/utils";
import { Timer } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  startTime: number;
  initialSeconds: number;
  onStart?: () => void;
  onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onStart,
  onExpire,
  startTime,
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
      <p className="flex items-center bg-gray-200 p-2 rounded-3xl gap-2 text-sm">
        <Timer size={20} />
        <span className="font-medium"> {formatTime(timeLeft)}</span>
      </p>
    </>
  );
};

export default CountdownTimer;
