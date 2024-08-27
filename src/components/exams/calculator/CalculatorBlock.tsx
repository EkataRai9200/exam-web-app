import { Button } from "@/components/ui/button";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";

function CalculatorBlock() {
  const { examData, dispatch } = useExamData();
  const [_value, setValue] = React.useState("");
  return (
    <div
      className={cn(
        "fixed max-w-full w-[250px] top-[10px] right-[10px] md:top-[10%] md:right-[100px] z-20 bg-gray-100",
        examData.studentExamState.showCalculator ? "block" : "hidden"
      )}
    >
      <Button
        className="absolute top-0 right-0 text-xs"
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setValue("");
          dispatch({
            type: "showHideCalculator",
            payload: false,
          });
        }}
      >
        close
      </Button>
      <div className="p-2">
        <iframe
          src={`http://${examData.authUser?.institute_url}/calculator.html`}
          height={350}
        ></iframe>
      </div>
    </div>
  );
}

export default CalculatorBlock;
