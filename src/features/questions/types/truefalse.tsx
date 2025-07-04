import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import React from "react";
import { QuestionTypeProps } from "../render";
import { MCQ_Style } from "./mcq";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function TRUEFALSE({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<Array<string | undefined>>([]);

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  React.useEffect(() => {
    if (activeLang == "EN") {
      setOptions([question?.opt1, question?.opt2]);
    } else {
      if (question?.hi_opt1) {
        setOptions([question?.hi_opt1, question?.hi_opt2]);
      } else {
        setOptions([]);
      }
    }
  }, [examData]);

  const ans = examData.studentExamState.activeAnswer ?? "";

  const markAnswer = (i: number) => {
    dispatch({
      type: "setActiveAnswer",
      payload: i == 0 ? "true" : "false",
    });
  };

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
        const status =
          (ans == "true" && i == 0) || (ans == "false" && i == 1)
            ? "answered"
            : "pending";
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
                dangerouslySetInnerHTML={{ __html: _v }}
              ></div>
            )}
          </div>
        );
      })}
    </>
  );
}
