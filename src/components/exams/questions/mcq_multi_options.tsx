import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import { QuestionTypeProps } from "./render";

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

  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans = studentResponse?.ans ?? "";

  const markAnswer = (i: number) => {
    const payload = {
      ...studentResponse,
      ans: i.toString(),
      sub_id: examData.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };
    dispatch({
      type: "markAnswer",
      payload,
    });
  };

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
        const status = i.toString() == ans ? "answered" : "pending";
        return (
          <div
            key={i}
            className={cn(
              "w-full rounded-lg p-1 flex items-center gap-2 cursor-pointer relative border  bg-white hover:bg-gray-100/50",
              status == "pending" ? "bg-white" : "",
              status == "answered" ? "border-green-600" : ""
            )}
            onClick={() => {
              markAnswer(i);
            }}
          >
            <div
              className={cn(
                "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full",
                status == "answered" ? "bg-green-600 text-white" : ""
              )}
            >
              {String.fromCharCode(65 + i)}
            </div>
            {_v && <div dangerouslySetInnerHTML={{ __html: _v.value }}></div>}
          </div>
        );
      })}
      {/* <div>{isSaved ? "Saved" : "Not Saved"}</div> */}
    </>
  );
}
