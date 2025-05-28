import React, { createContext, useContext } from "react";
import { useTimerManager } from "./useTimerManager";

type TimerContextType = ReturnType<typeof useTimerManager>;

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const timer = useTimerManager();
  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};

export default TimerProvider;
