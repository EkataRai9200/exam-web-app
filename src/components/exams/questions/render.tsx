import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { MCQOption } from "@/components/exams/questions/mcq";
import { ExamDetailData, Question } from "@/context/ExamContext";
import { cn } from "@/lib/utils";
import { useExamData } from "@/lib/hooks";

interface RenderQuestionProps {
  index: number;
  isActive: boolean;
  setActive: Function;
  subjectIndex: number;
}

export function RenderQuestion({
  index,
  isActive,
  subjectIndex,
}: RenderQuestionProps) {
  const [isMarked, setIsMarked] = React.useState(false);
  const [isAnswered, setIsAnswered] = React.useState(true);

  const { examData, dispatch } = useExamData();
  const question = examData.subjects[subjectIndex].questions[index];

  return (
    <>
      <Card className={cn("w-full", isActive ? "visible" : "hidden")}>
        <CardHeader className="relative px-3 py-1">
          <div className="pt-1">
            <p className="text-sm text-muted-foreground">Q{index + 1}.</p>
          </div>
          <div>
            {isMarked ? (
              <p className="text-yellow-600 mt-2 italic font-medium">
                Question is Marked for review
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="absolute right-3 top-0 flex items-center gap-2 pe-2">
            <Badge className="bg-gray-100 text-gray-600 font-medium uppercase px-1">
              {question.question_type}
            </Badge>
            <Badge className="bg-green-100 text-green-500 font-medium px-1">
              +{question.marks_positive}
            </Badge>
            <Badge className="bg-red-100 text-red-500 font-medium px-1">
              -{question.marks_negative}
            </Badge>
            <LanguageDropdown />
          </div>
        </CardHeader>
        <CardContent>
          {" "}
          {/* <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {}
          </h3> */}
          <div dangerouslySetInnerHTML={{ __html: question.question }}></div>
          {/* MCQ OPTION */}
          <div className="flex flex-col gap-3 mt-5">
            {question.question_type == "MCQ" && (
              <MCQOption subjectIndex={subjectIndex} index={index} />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
