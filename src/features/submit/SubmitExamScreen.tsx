import { useExamData } from "@/lib/hooks";

import { Button } from "@/components/ui/button";

import TimerDisplay from "@/features/timer/TimerDisplay";
import { TestOverview } from "./components/TestOverview";
import { SubjectWiseOverviewCarousel } from "./components/SubjectWiseOverviewCarousel";
import React from "react";
import { cn } from "@/utils/common";

function SubmitExamScreen() {
  const { examData, submitExam, isLoaded, dispatch } = useExamData();

  const [loading, setLoading] = React.useState(false);

  if (!examData.studentExamState.showSubmitModal) return <></>;

  return (
    <div
      className={cn(
        "bg-gray-200 fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center"
      )}
    >
      <div className="flex flex-col gap-4 p-2 md:gap-2 w-full md:w-[500px]">
        <div className="flex items-center w-full justify-between p-2 bg-white">
          <h5 className="scroll-m-20 text-lg font-medium tracking-tight">
            {examData.test_name}
          </h5>
          <div className="flex gap-4">
            {examData.subjects.length > 0 &&
            examData.start_date &&
            isLoaded &&
            !examData.studentExamState.submitted ? (
              <TimerDisplay />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <TestOverview />
          <SubjectWiseOverviewCarousel />
        </div>
        <div className="flex flex-col md:flex-col justify-between gap-4 bottom-0 w-full p-2">
          <Button
            className="bg-green-600 w-full"
            size={"lg"}
            onClick={async () => {
              setLoading(true);
              await submitExam({
                submission_source: "manual",
              });
              setLoading(false);
            }}
            disabled={loading}
          >
            Submit Exam
          </Button>
          <Button
            variant={"outline"}
            className=" w-full"
            size={"lg"}
            onClick={() =>
              dispatch({
                type: "setShowSubmitModal",
                payload: false,
              })
            }
            disabled={loading}
          >
            Go Back to Questions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubmitExamScreen;
