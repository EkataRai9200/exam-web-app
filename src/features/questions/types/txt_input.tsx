import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import { QuestionTypeProps } from "../render";

interface RenderTXT_INPUTOptionProps extends QuestionTypeProps {}

export function TXT_INPUT({ index, subjectIndex }: RenderTXT_INPUTOptionProps) {
  const { examData, dispatch } = useExamData();

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans =
    typeof examData.studentExamState.activeAnswer === "object"
      ? studentResponse?.ans ?? []
      : [];

  const markAnswer = (i: number, inputVal: string) => {
    const a = ans;
    if (inputVal != "") a[i] = inputVal;
    else {
      delete a[i];
    }

    dispatch({
      type: "setActiveAnswer",
      payload: a,
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

      <h5 className="scroll-m-20 text-md font-semibold tracking-tight">
        Answers
      </h5>
      <hr />
      {Array.from(Array(question.txt_inputs_count)).map((_v, i) => {
        return (
          <div
            key={i}
            className={cn(
              "w-full bg-white border rounded-lg p-2 flex items-center gap-2 relative"
            )}
          >
            <Label>{i + 1}</Label>
            <Input
              type="text"
              defaultValue={ans[i] ?? ""}
              onBlur={(e) => markAnswer(i, e.target.value)}
              placeholder={`Input ${i + 1}`}
            />
          </div>
        );
      })}
      {/* <div>{isSaved ? "Saved" : "Not Saved"}</div> */}
    </>
  );
}
