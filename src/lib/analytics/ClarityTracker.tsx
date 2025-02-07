import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ClarityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if ((window as any).clarity) {
      (window as any).clarity("set", "page", location.pathname);
    }
  }, [location]);

  return null;
};
