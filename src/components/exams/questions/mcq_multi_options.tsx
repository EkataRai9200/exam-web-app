import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import { QuestionTypeProps } from "./render";
import { MCQ_Style } from "./mcq";

interface RenderMCQ_MULTI_OPTIONSOptionProps extends QuestionTypeProps {}

export function MCQ_MULTI_OPTIONS({
  index,
  subjectIndex,
}: RenderMCQ_MULTI_OPTIONSOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<
    Array<{ value: string } | undefined>
  >([]);

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  const ans = examData.studentExamState.activeAnswer ?? "";

  const markAnswer = (i: number) => {
    dispatch({
      type: "setActiveAnswer",
      payload: i.toString(),
    });
  };

  React.useEffect(() => {
    if (activeLang == "EN") {
      setOptions(question?.slct_options ?? []);
    } else {
      if (question?.hi_opt1) {
        setOptions([]);
      } else {
        setOptions([]);
      }
    }
  }, [examData]);

  React.useEffect(() => {
    if ((window as any).MathJax) (window.MathJax as any).typesetPromise();
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

      {options.map((_v, i) => {
        const status = i.toString() == ans ? "answered" : "pending";
        return (
          <div
            key={i}
            className={cn(
              MCQ_Style.wrapper,
              status == "pending" ? "bg-white" : "",
              status == "answered" ? "border-green-600" : ""
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
            {_v && (
              <div
                className="no-tailwindcss-base ck-editor"
                dangerouslySetInnerHTML={{ __html: _v.value }}
              ></div>
            )}
          </div>
        );
      })}
      {/* <div>{isSaved ? "Saved" : "Not Saved"}</div> */}
    </>
  );
}
