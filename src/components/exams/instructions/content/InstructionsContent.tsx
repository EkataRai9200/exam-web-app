import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import EnglishInstructionsContent from "./EnglishInstructionsContent";
import HindiInstructionsContent from "./HindiInstructionsContent";

function InstructionsContent({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const { examData } = useExamData();

  return (
    <div
      className={cn(
        "absolute flex flex-col h-full w-full top-0 left-0 bg-white z-20",
        open ? "visible" : "hidden"
      )}
    >
      <h1 className="w-full text-center py-2 font-medium">Instructions</h1>
      <ScrollArea className="pb-5 px-5 font-serif text-sm">
        {examData.studentExamState.activeLang === "EN" && (
          <EnglishInstructionsContent />
        )}
        {examData.studentExamState.activeLang === "HI" && (
          <HindiInstructionsContent />
        )}
      </ScrollArea>
      <div className="flex justify-center py-2">
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Back
        </Button>
      </div>
    </div>
  );
}

export default InstructionsContent;
