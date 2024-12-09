import { useExamData } from "@/lib/hooks";
import { formatTimeToJSON } from "@/lib/utils";
import { Timer } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  onExpire?: () => void;
  beforeText?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  onExpire,
  beforeText,
}) => {
  const { examData, getRemainingTime, isLoaded } = useExamData();

  const timeLimit = parseInt(examData.test_time_limit) * 60;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const updateRemainingTime = () => {
      const timeLeft = Math.max(0, getRemainingTime(examData));
      if (timeLeft <= 0 && intervalRef.current) {
        if (
          examData.subject_time != "yes" ||
          (examData.subject_time == "yes" &&
            examData.studentExamState.activeSubject >=
              examData.subjects.length - 1)
        )
          clearInterval(intervalRef.current);
        onExpire && onExpire();
      }
      setTimeLeft(timeLeft);
    };
    intervalRef.current = setInterval(updateRemainingTime, 1000);
    updateRemainingTime();

    return () => {
      if (intervalRef.current && examData.subject_time != "yes") {
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
