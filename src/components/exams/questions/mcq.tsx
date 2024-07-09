import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface RenderMCQOptionProps {
  index: number;
  subjectIndex: number;
}

export function MCQOption({ index, subjectIndex }: RenderMCQOptionProps) {
  // const [ans, setAns] = React.useState<number | undefined>(undefined);

  const { examData, dispatch } = useExamData();

  const question: Question = examData.subjects[subjectIndex].questions[index];

  const options = [
    question?.opt1,
    question?.opt2,
    question?.opt3,
    question?.opt4,
  ];

  const ans =
    examData.studentExamState.student_answers[question._id.$oid]?.ans ?? "";

  const markAnswer = (i: number) => {
    dispatch({
      type: "markAnswer",
      payload: {
        ans: String.fromCharCode(65 + i),
        image: {},
        pdf: "",
        qid: question._id.$oid,
        qtype: question.question_type,
        tt: 0,
      },
    });
  };

  return (
    <>
      {options.map((_v, i) => {
        const status =
          String.fromCharCode(65 + i) == ans ? "answered" : "pending";
        return (
          <div
            key={i}
            className={cn(
              "w-full bg-white border rounded-lg p-2 flex items-center gap-2 cursor-pointer relative",
              status == "pending" ? "bg-white" : "",
              status == "answered" ? "bg-blue-100" : ""
            )}
            onClick={() => {
              markAnswer(i);
            }}
          >
            <div
              className={cn(
                "border w-10 h-10 flex items-center justify-center text-center rounded-full",
                status == "answered" ? "bg-blue-400 text-white" : ""
              )}
            >
              {String.fromCharCode(65 + i)}
            </div>
            {_v && <div dangerouslySetInnerHTML={{ __html: _v }}></div>}

            {/* <CheckCircle size={15} className="absolute right-5 text-blue-400" /> */}
          </div>
        );
      })}
    </>
  );
}
