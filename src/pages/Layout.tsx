import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { AnalyticsTracker } from "@/lib/analytics/AnalyticsTracker";
import { ClarityTracker } from "@/lib/analytics/ClarityTracker";
import { Outlet } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

function Layout() {
  return (
    <ExamProvider>
      <Outlet />
      <ClarityTracker />
      <AnalyticsTracker />
      <Toaster />
      <SonnerToaster richColors />
    </ExamProvider>
  );
}

export default Layout;
