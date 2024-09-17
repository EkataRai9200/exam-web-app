import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export const MCQ_Style = {
  wrapper:
    "w-full rounded-lg p-1 flex items-center gap-2 cursor-pointer relative bg-white hover:bg-gray-100/50",
  label:
    "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full",
};

export function MCQ({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<Array<string | undefined>>([]);

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  React.useEffect(() => {
    if (activeLang == "EN") {
      const enOptions = [
        question?.opt1,
        question?.opt2,
        question?.opt3,
        question?.opt4,
      ];
      if (question?.opt5) enOptions.push(question?.opt5);
      setOptions(enOptions);
    } else {
      if (question?.hi_opt1) {
        const hiOptions = [
          question?.hi_opt1,
          question?.hi_opt2,
          question?.hi_opt3,
          question?.hi_opt4,
        ];
        if (question?.hi_opt5) hiOptions.push(question?.hi_opt5);
      } else {
        setOptions([]);
      }
    }
  }, [examData]);

  const markAnswer = (i: number) => {
    dispatch({
      type: "setActiveAnswer",
      payload: String.fromCharCode(65 + i).toLowerCase(),
    });
  };

  const activeAnswer = examData.studentExamState.activeAnswer;

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html:
            activeLang == "EN"
              ? question?.question
              : question?.hi_question ?? "",
        }}
      ></div>
      {options.map((_v, i) => {
        const status =
          String.fromCharCode(65 + i).toLowerCase() == activeAnswer
            ? "answered"
            : "pending";
        return (
          <div
            key={i}
            className={cn(
              MCQ_Style.wrapper,
              status == "pending" ? "" : "",
              status == "answered" ? "border-green-600 bg-gray-100/50" : ""
            )}
            onClick={() => {
              markAnswer(i);
            }}
          >
            <div
              className={cn(
                MCQ_Style.label,
                status == "answered" ? "bg-green-600 text-white" : ""
              )}
            >
              {String.fromCharCode(65 + i)}
            </div>
            {_v && <div dangerouslySetInnerHTML={{ __html: _v }}></div>}
          </div>
        );
      })}
    </>
  );
}
