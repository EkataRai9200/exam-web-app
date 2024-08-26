import { Button } from "@/components/ui/button";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";

function CalculatorBlock() {
  const { examData, dispatch } = useExamData();
  const [_value, setValue] = React.useState("");
  // const _keyboard = React.useRef<any>(null);
  return (
    <div
      className={cn(
        "fixed max-w-full w-[700px] md:bottom-[15%] md:right-[50px] z-20 bg-gray-300 p-5",
        examData.studentExamState.showKeyboard ? "block" : "hidden"
      )}
    >
      <Button
        className="absolute top-0 right-0 text-xs"
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setValue("");
          dispatch({
            type: "showHideKeyboard",
            payload: false,
          });
        }}
      >
        close
      </Button>
      <div className="p-2">Calculator....</div>
    </div>
  );
}

export default CalculatorBlock;
