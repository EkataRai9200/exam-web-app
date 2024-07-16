import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "./render";

interface RenderMULTI_SLCTOptionProps extends QuestionTypeProps {}

export default function MULTI_SLCT({
  index,
  subjectIndex,
}: RenderMULTI_SLCTOptionProps) {
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

  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans: Array<string> =
    typeof studentResponse?.ans === "object" ? studentResponse?.ans ?? [] : [];

  useEffect(() => {
    if (!examData.studentExamState.student_answers[question._id.$oid]) {
      //
    }
  }, [question]);

  const markAnswer = (i: string, _checked: boolean) => {
    const payload = {
      ...studentResponse,
      ans: ans.includes(i) ? ans.filter((a) => a !== i) : [...ans, i],
      sub_id: examData.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };
    dispatch({
      type: "markAnswer",
      payload,
    });
  };

  const [showDropdown, setShowDropdown] = React.useState(false);

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

      <DropdownMenu open={showDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {showDropdown ? "Hide" : "Show"} Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onPointerDownOutside={() => setShowDropdown(false)}
          className="w-56"
        >
          {options.map((o, i) => {
            return (
              <DropdownMenuCheckboxItem
                checked={ans.filter((c) => c == i.toString()).length > 0}
                onCheckedChange={(checked) => markAnswer(i.toString(), checked)}
                key={i}
              >
                {o?.value ?? ""}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
