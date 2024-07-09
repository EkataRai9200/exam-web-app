import { ExamProvider } from "@/context/ExamContext";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <ExamProvider>
      <Outlet />
    </ExamProvider>
  );
}

export default Layout;
