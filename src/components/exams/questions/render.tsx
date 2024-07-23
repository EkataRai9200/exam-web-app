import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { MAQ } from "@/components/exams/questions/maq";
import { MCQ } from "@/components/exams/questions/mcq";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import Passage from "../passage/Passage";
import { MCQ_MULTI_OPTIONS } from "./mcq_multi_options";
import MULTI_SLCT from "./multi_slct";
import { NAT } from "./nat";
import SLCT from "./slct";
import { Subjective } from "./subjective";
import { TRUEFALSE } from "./truefalse";
import { TXT_INPUT } from "./txt_input";

export enum QuestionType {
  MCQ = "MCQ",
  MAQ = "MAQ",
  VMAQ = "VMAQ",
  SUBJECTIVE = "SUBJECTIVE",
  NAT = "NAT",
  TRUEFALSE = "TrueFalse",
  SLCT = "SLCT",
  MULTI_SLCT = "MULTI_SLCT",
  MCQ_MULTI_OPTIONS = "MCQ_MULTI_OPTIONS",
  TXT_INPUT = "TXT_INPUT",
  FILL_BLANKS = "FILL_BLANKS",
  SENTENCE_ARRANGMENT = "SENTENCE_ARRANGMENT",
}

interface RenderQuestionProps {
  index: number;
  isActive: boolean;
  setActive: (value: any) => void;
  subjectIndex: number;
}

export interface QuestionTypeProps {
  index: number;
  subjectIndex: number;
}

export function RenderQuestion({
  index,
  isActive,
  subjectIndex,
}: RenderQuestionProps) {
  const [isMarked] = React.useState(false);

  const { examData } = useExamData();
  const question = examData.subjects[subjectIndex].questions[index];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {question.show_qs_passage && (
          <Passage
            index={index}
            isActive={isActive}
            subjectIndex={subjectIndex}
          />
        )}

        <Card
          className={cn(
            "w-full",
            isActive ? "visible" : "hidden",
            question.show_qs_passage ? "md:w-2/3" : ""
          )}
        >
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
            <div className="absolute right-3 top-0 flex items-center gap-2">
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
          <CardContent className="px-3">
            <div className="flex flex-col gap-3 mt-5">
              {question.question_type == QuestionType.MCQ && (
                <MCQ subjectIndex={subjectIndex} index={index} />
              )}
              {(question.question_type == QuestionType.MAQ ||
                question.question_type == QuestionType.VMAQ) && (
                <MAQ subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.SUBJECTIVE && (
                <Subjective subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.NAT && (
                <NAT subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.TRUEFALSE && (
                <TRUEFALSE subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.SLCT && (
                <SLCT subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.MULTI_SLCT && (
                <MULTI_SLCT subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.MCQ_MULTI_OPTIONS && (
                <MCQ_MULTI_OPTIONS subjectIndex={subjectIndex} index={index} />
              )}
              {question.question_type == QuestionType.TXT_INPUT && (
                <TXT_INPUT subjectIndex={subjectIndex} index={index} />
              )}
              {/* {question.question_type == QuestionType.SENTENCE_ARRANGMENT && (
              <SENTENCE_ARRANGMENT subjectIndex={subjectIndex} index={index} />
            )} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
