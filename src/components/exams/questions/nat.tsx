import { Input } from "@/components/ui/input";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import React, { useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function NAT({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  const [value, setValue] = React.useState(
    examData.studentExamState.activeAnswer ?? null
  );

  useEffect(() => {
    dispatch({
      type: "setActiveAnswer",
      payload: value,
    });
  }, [value]);

  useEffect(() => {
    if (!examData.studentExamState.student_answers[question._id.$oid]) {
      setValue("");
      keyboard.current.setInput("");
    }
  }, [examData.studentExamState.student_answers[question._id.$oid]]);

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
      <h5 className="text-md font-medium">Answer</h5>
      <div className="md:w-[300px] flex flex-col gap-4">
        <Input
          type="text"
          value={value ?? ""}
          onChange={(e) => {
            if (/^[0-9.]+$/.test(e.target.value)) {
              setValue(e.target.value);
              keyboard.current.setInput(e.target.value);
            } else {
              return false;
            }
          }}
        />
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layout={{
            default: ["1 2 3", "4 5 6", "7 8 9", "0 . {bksp}"],
          }}
          theme="hg-theme-default hg-layout-numeric numeric-theme"
          onChange={(input) => {
            setValue(input);
          }}
          onKeyPress={() => {}}
        />
      </div>
    </>
  );
}
