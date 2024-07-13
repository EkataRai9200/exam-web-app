import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function MAQ({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<Array<string | undefined>>([]);
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans = studentResponse?.ans ?? "";
  const ansArr = ans != "" ? ans.split(",") : [];

  React.useEffect(() => {
    if (activeLang == "EN") {
      let o = [question?.opt1, question?.opt2, question?.opt3, question?.opt4];
      if (question?.opt5) o.push(question?.opt5);
      setOptions(o);
    } else {
      if (question?.hi_opt1) {
        let o_hi = [
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

  const markAnswer = (i: number) => {
    if (ansArr.includes(String.fromCharCode(65 + i).toLowerCase()))
      ansArr.splice(
        ansArr.indexOf(String.fromCharCode(65 + i).toLowerCase()),
        1
      );
    else ansArr.push(String.fromCharCode(65 + i).toLowerCase());
    console.log(ansArr);

    const payload = {
      ...studentResponse,
      ans: ansArr.join(",").trim(),
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
        const status = ansArr.includes(
          String.fromCharCode(65 + i).toLowerCase()
        )
          ? "answered"
          : "pending";
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
          </div>
        );
      })}
      {/* <div>{isSaved ? "Saved" : "Not Saved"}</div> */}
    </>
  );
}
