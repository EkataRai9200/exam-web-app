import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
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

  // const studentResponse =
  //   examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans: Array<string> =
    typeof examData.studentExamState.activeAnswer === "object"
      ? examData.studentExamState.activeAnswer ?? []
      : [];

  // useEffect(() => {
  //   if (!examData.studentExamState.student_answers[question._id.$oid]) {
  //     //
  //   }
  // }, [question]);

  const markAnswer = (i: string, _checked: boolean) => {
    dispatch({
      type: "setActiveAnswer",
      payload: ans.includes(i) ? ans.filter((a) => a !== i) : [...ans, i],
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
      <Label htmlFor="message">Answer</Label>

      <DropdownMenu open={showDropdown}>
        <DropdownMenuTrigger asChild>
          <div
            className="cursor-pointer inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background h-10 px-4 py-2 justify-between"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {ans.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ans.map((a) => {
                  return (
                    <Badge variant="secondary">
                      {options[parseInt(a)]?.value}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              "Select Options"
            )}
            <span className="">
              {showDropdown ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onPointerDownOutside={() => setShowDropdown(false)}
          className="w-full"
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
