import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function NAT({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};

  const [value, setValue] = React.useState(studentResponse?.ans ?? null);

  useEffect(() => {
    if (!examData.studentExamState.student_answers[question._id.$oid]) {
      setValue("");
      keyboard.current.setInput("");
      setIsSaved(false);
    }
  }, [examData.studentExamState.student_answers[question._id.$oid]]);

  const saveLatestAnswer = () => {
    const payload = {
      ...studentResponse,
      ans: value,
      sub_id: examData.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };
    dispatch({
      type: "markAnswer",
      payload,
    });
    setIsSaved(true);
  };

  // useEffect(() => {
  //   if (
  //     examData.studentExamState.activeQuestion === index + 1 ||
  //     examData.studentExamState.activeQuestion === index
  //   )
  //     saveLatestAnswer();
  // }, [examData.studentExamState.activeQuestion]);

  const [isSaved, setIsSaved] = React.useState(false);

  const keyboard = React.useRef<any>(null);

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
      <hr />
      <h5 className="text-md font-medium">Answer</h5>
      <div className="md:w-[300px] flex flex-col gap-4">
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            setValue(e.target.value);
            setIsSaved(false);
            keyboard.current.setInput(e.target.value);
          }}
        />
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layout={{
            default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp} "],
          }}
          theme="hg-theme-default hg-layout-numeric numeric-theme"
          onChange={(input) => {
            setValue(input);
            setIsSaved(false);
          }}
          onKeyPress={() => {}}
        />
      </div>
      <div>
        <Button
          disabled={isSaved}
          variant={"outline"}
          className="flex gap-2"
          onClick={saveLatestAnswer}
        >
          {isSaved ? (
            <>
              Answer Saved <CheckCircle size={12} />
            </>
          ) : (
            "Save Answer"
          )}
        </Button>
      </div>
    </>
  );
}
