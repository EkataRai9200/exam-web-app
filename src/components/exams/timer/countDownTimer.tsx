import { useTimer } from "@/features/timer/TImerContext";
import { formatTimeToJSON } from "@/lib/utils";
import { Timer } from "lucide-react";
import React from "react";

interface CountdownTimerProps {
  onExpire?: () => void;
  beforeText?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ beforeText }) => {
  const timer = useTimer();
  const formatTime =
    timer.remaining != null
      ? formatTimeToJSON(Math.floor(timer.remaining / 1000))
      : { h: "0", m: "0", s: "0" };

  return (
    <>
      <p className="flex items-center w-full md:w-auto bg-gray-100  rounded-sm p-1 md:p-2 gap-2 text-sm">
        <Timer size={20} />
        {beforeText && (
          <span className="font-medium text-sm">{beforeText}</span>
        )}
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTime.h}
        </span>
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTime.m}
        </span>
        <span className="font-medium w-7 h-6 flex items-center justify-center bg-gray-300">
          {formatTime.s}
        </span>
      </p>
    </>
  );
};

export default CountdownTimer;
