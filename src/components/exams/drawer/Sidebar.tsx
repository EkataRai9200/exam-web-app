import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExamDrawerContent from "./examDrawerContent";

function Sidebar({
  showSidebar,
  setShowSidebar,
  setShowQuestionPaper,
  setShowInstructions,
}: {
  showSidebar: boolean;
  setShowSidebar: any;
  setShowQuestionPaper: any;
  setShowInstructions: any;
}) {
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
          "hidden pt-5 md:pt-0  w-full border-l-2 h-screen overflow-y-clip",
          showSidebar ? "md:block" : "hidden"
        )}
      >
        <ExamDrawerContent
          setShowQuestionPaper={setShowQuestionPaper}
          setShowInstructions={setShowInstructions}
        />
      </div>
    </div>
  );
}

export default Sidebar;
