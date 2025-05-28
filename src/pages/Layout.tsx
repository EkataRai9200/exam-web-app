import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import TimerProvider from "@/features/timer/TImerContext";
import { AnalyticsTracker } from "@/lib/analytics/AnalyticsTracker";
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
          {typeof window !== "undefined" && <Outlet />}
          <AnalyticsTracker />
          <Toaster />
          <SonnerToaster richColors />
        </TimerProvider>
      </ExamProvider>
    </MathJaxContext>
  );
}

export default Layout;
