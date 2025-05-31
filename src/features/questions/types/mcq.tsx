import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "../render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export const MCQ_Style = {
  wrapper:
    "w-full rounded-lg p-1 flex items-center gap-2 cursor-pointer relative bg-white hover:bg-gray-100/50",
  label:
    "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full",
};

export function MCQ({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<
    Array<{ index: number; value: string | undefined }>
  >([]);
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const randomOrder = examData.studentExamState?.student_answers[
    question._id.$oid
  ]?.mcq_shuffled_order ?? [0, 1, 2, 3, 4];

  const markAnswer = (i: number) => {
    dispatch({
      type: "setActiveAnswer",
      payload: String.fromCharCode(65 + i).toLowerCase(),
    });
  };

  const activeAnswer = examData.studentExamState.activeAnswer;

  React.useEffect(() => {
    if (activeLang == "EN") {
      const enOptions = [
        { index: 0, value: question?.opt1 },
        { index: 1, value: question?.opt2 },
        { index: 2, value: question?.opt3 },
        { index: 3, value: question?.opt4 },
      ];
      if (question?.opt5) enOptions.push({ index: 4, value: question?.opt5 });
      setOptions(enOptions);
    } else {
      if (question?.hi_opt1) {
        const hiOptions = [
          { index: 0, value: question?.hi_opt1 },
          { index: 1, value: question?.hi_opt2 },
          { index: 2, value: question?.hi_opt3 },
          { index: 3, value: question?.hi_opt4 },
        ];
        if (question?.hi_opt5)
          hiOptions.push({ index: 4, value: question?.hi_opt5 });
        setOptions(hiOptions);
      } else {
        setOptions([]);
      }
    }
  }, []);

  useEffect(() => {
    if (
      (window as any).MathJax &&
      typeof (window.MathJax as any).typesetPromise == "function"
    )
      (window.MathJax as any).typesetPromise();
  }, [options]);

  return (
    <>
      <div
        className="no-tailwindcss-base ck-editor"
        dangerouslySetInnerHTML={{
          __html:
            activeLang == "EN"
              ? question?.question
              : question?.hi_question ?? "",
        }}
      ></div>
      {options
        .sort(
          (a, b) => randomOrder.indexOf(a.index) - randomOrder.indexOf(b.index)
        )
        .map((_v, i) => {
          const status =
            String.fromCharCode(65 + _v.index).toLowerCase() == activeAnswer
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
                markAnswer(_v.index);
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

              {_v && (
                <>
                  <div
                    className="no-tailwindcss-base ck-editor w-full"
                    dangerouslySetInnerHTML={{ __html: _v.value ?? "" }}
                  ></div>
                </>
              )}
            </div>
          );
        })}
    </>
  );
}
