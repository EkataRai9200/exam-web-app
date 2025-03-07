import { useExamData } from "@/lib/hooks";
import { formatTimeToJSON } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface CATCountdownTimerProps {
  onExpire?: () => void;
  beforeText?: string;
}

export const CATCountdownTimer: React.FC<CATCountdownTimerProps> = ({
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

    if (!intervalRef.current)
      intervalRef.current = setInterval(updateRemainingTime, 1000);

    return () => {
      if (intervalRef.current && examData.subject_time != "yes") {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <p className="text-sm font-bold min-w-[140px]">
        {beforeText && <>{beforeText} </>}
        {formatTimeToJSON(timeLeft).h != "00" && (
          <>
            <span>{formatTimeToJSON(timeLeft).h}</span>:
          </>
        )}
        <span>{formatTimeToJSON(timeLeft).m}</span>:
        <span>{formatTimeToJSON(timeLeft).s}</span>
      </p>
    </>
  );
};

export default CATCountdownTimer;
