import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import React from "react";
import { QuestionTypeProps } from "../render";
import { Checkbox } from "@/components/ui/checkbox";
import { MCQ_Style } from "./mcq";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function MAQ({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<Array<string | undefined>>([]);
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const ans = examData.studentExamState.activeAnswer ?? "";
  const ansArr = typeof ans == "string" && ans != "" ? ans.split(",") : [];

  const markAnswer = (i: number) => {
    if (ansArr.includes(String.fromCharCode(65 + i).toLowerCase()))
      ansArr.splice(
        ansArr.indexOf(String.fromCharCode(65 + i).toLowerCase()),
        1
      );
    else ansArr.push(String.fromCharCode(65 + i).toLowerCase());
    dispatch({
      type: "setActiveAnswer",
      payload: ansArr.join(",").trim(),
    });
  };

  React.useEffect(() => {
    if (activeLang == "EN") {
      const o = [
        question?.opt1,
        question?.opt2,
        question?.opt3,
        question?.opt4,
      ];
      if (question?.opt5) o.push(question?.opt5);
      setOptions(o);
    } else {
      if (question?.hi_opt1) {
        const o_hi = [
          question?.hi_opt1,
          question?.hi_opt2,
          question?.hi_opt3,
          question?.hi_opt4,
        ];
        if (question?.hi_opt5) o_hi.push(question?.hi_opt5);
        setOptions(o_hi);
      } else {
        setOptions([]);
      }
    }
  }, [examData]);

  React.useEffect(() => {
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

      {options.map((_v, i) => {
        const status = ansArr.includes(
          String.fromCharCode(65 + i).toLowerCase()
        )
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
            <Checkbox
              className={
                status == "answered"
                  ? "border-green-600 data-[state=checked]:bg-green-600"
                  : ""
              }
              checked={status == "answered"}
            />
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
