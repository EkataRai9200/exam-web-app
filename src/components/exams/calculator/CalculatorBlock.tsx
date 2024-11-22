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
        "fixed max-w-full top-[10px] right-[10px] md:top-[10%] md:right-[100px] z-20 bg-gray-100",
        examData.studentExamState.showCalculator ? "block" : "hidden",
        examData.is_calc_allow == "1" ? "w-[520px]" : "w-[250px]"
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
          className="w-full"
          src={`https://${examData.authUser?.institute_url}/calculator.html?version=${examData.is_calc_allow}`}
          height={370}
        ></iframe>
      </div>
    </div>
  );
}

export default CalculatorBlock;
