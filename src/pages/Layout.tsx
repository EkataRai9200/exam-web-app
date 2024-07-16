import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { Outlet } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

function Layout() {
  return (
    <ExamProvider>
      <Outlet />
      <Toaster />
      <SonnerToaster richColors />
    </ExamProvider>
  );
}

export default Layout;
