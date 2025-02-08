import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { AnalyticsTracker } from "@/lib/analytics/AnalyticsTracker";
import { ClarityTracker } from "@/lib/analytics/ClarityTracker";
import { Outlet } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";
import {
  MathJaxContext,
} from "better-react-mathjax";

function Layout() {
  const mathjaxConfig = {
    menuSettings: { inTabOrder: false },
    options: {
      enableMenu: false,
    },
  };
  return (
    <MathJaxContext config={mathjaxConfig}>
      <ExamProvider>
        <Outlet />
        <ClarityTracker />
        <AnalyticsTracker />
        <Toaster />
        <SonnerToaster richColors />
      </ExamProvider>
    </MathJaxContext>
  );
}

export default Layout;
