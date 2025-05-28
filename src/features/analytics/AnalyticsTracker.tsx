import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { logPageView } from "@/features/analytics/analytics";

export const AnalyticsTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // Detects route changes

  useEffect(() => {
    logPageView(location.pathname);
  }, [location, navigationType]);

  return null;
};
