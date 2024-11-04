import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

function Layout() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const metaTag = document.createElement("meta");
      metaTag.httpEquiv = "Content-Security-Policy";
      metaTag.content = "upgrade-insecure-requests";
      document.head.appendChild(metaTag);
    }
  }, []);

  return (
    <ExamProvider>
      <Outlet />
      <Toaster />
      <SonnerToaster richColors />
    </ExamProvider>
  );
}

export default Layout;
