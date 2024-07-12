import { Toaster } from "@/components/ui/toaster";
import { ExamProvider } from "@/context/ExamContext";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <ExamProvider>
      <Outlet />
      <Toaster />
    </ExamProvider>
  );
}

export default Layout;
