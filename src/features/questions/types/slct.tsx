import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "../render";

interface RenderSLCTOptionProps extends QuestionTypeProps {}

export default function SLCT({ index, subjectIndex }: RenderSLCTOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<
    Array<{ value: string } | undefined>
  >([]);

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  React.useEffect(() => {
    if (activeLang == "EN") {
      setOptions(question.slct_options ?? []);
    } else {
      setOptions(question.hi_slct_options ?? []);
    }
  }, [examData]);

  const ans = examData.studentExamState.activeAnswer ?? "";

  useEffect(() => {
    if (!examData.studentExamState.student_answers[question._id.$oid]) {
      //
    }
  }, [question]);

  const markAnswer = (i: string) => {
    dispatch({
      type: "setActiveAnswer",
      payload: i.toString(),
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

      <Select onValueChange={markAnswer} defaultValue={ans.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="Select Option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o, i) => {
            return (
              <SelectItem key={i} value={i.toString()}>
                <span
                  dangerouslySetInnerHTML={{ __html: o?.value ?? "" }}
                ></span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
