import { Button } from "@/components/ui/button";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

function CalculatorBlock() {
  const { examData, dispatch } = useExamData();
  const [_value, setValue] = React.useState("");
  return (
    <div
      className={cn(
        "fixed max-w-full top-[27%] right-0 z-20",
        examData.studentExamState.showCalculator ? "block" : "hidden",
        examData.is_calc_allow == "1" ? "w-[490px]" : "w-[240px]"
      )}
    >
      <Button
        className="absolute rounded-none top-0 right-[10px] text-xs bg-red-700 hover:bg-red-900"
        variant={"destructive"}
        size={"icon"}
        onClick={() => {
          setValue("");
          dispatch({
            type: "showHideCalculator",
            payload: false,
          });
        }}
      >
        <X size={16} />
      </Button>
      <div>
        <iframe
          className="w-full"
          src={`https://${examData.authUser?.institute_url}/calculator.html?version=${examData.is_calc_allow}`}
          height={370}
        ></iframe>
      </div>
    </div>
  );
}

export default CalculatorBlock;
