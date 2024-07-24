import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import ExamDrawerContent from "./examDrawerContent";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

function Sidebar({
  showSidebar,
  setShowSidebar,
}: {
  showSidebar: boolean;
  setShowSidebar: any;
}) {
  const [searchParams] = useSearchParams();
  return (
    <div className={cn("relative h-screen", showSidebar ? "md:w-1/4" : "")}>
      <div className="absolute left-[-15px] top-[calc(50%-60px)] h-[60px] w-[15px] hidden md:block">
        <button
          type="button"
          className="p-0 bg-slate-800 text-white flex items-center justify-center text-center  w-full h-full"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
      <div
        className={cn(
          "hidden pt-5 md:pt-0 bg-white w-full border-l-2 h-screen overflow-y-clip",
          showSidebar ? "md:block" : "hidden"
        )}
      >
        <ExamDrawerContent />
      </div>
    </div>
  );
}

export default Sidebar;
