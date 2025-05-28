import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { AnalyticsTracker } from "@/features/analytics/AnalyticsTracker";
import TimerProvider from "@/features/timer/TImerContext";
import { MathJaxContext } from "better-react-mathjax";
import { Outlet } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

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
        <TimerProvider>
          <Outlet />
          <AnalyticsTracker />
          <Toaster />
          <SonnerToaster richColors />
        </TimerProvider>
      </ExamProvider>
    </MathJaxContext>
  );
}

export default Layout;
