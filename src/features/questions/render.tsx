import { MAQ } from "./types/maq";
import { MCQ } from "./types/mcq";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import { MathJax } from "better-react-mathjax";
import { Calculator, Keyboard } from "lucide-react";
import { AUDIO_TYPE } from "./types/AUDIO_TYPE";
import { SENTENCE_ARRANGMENT } from "./types/SENTENCE_ARRANGMENT";
import { FILL_BLANKS } from "./types/fill_blanks";
import { MCQ_MULTI_OPTIONS } from "./types/mcq_multi_options";
import { MTQ } from "./types/mtq";
import MULTI_SLCT from "./types/multi_slct";
import { NAT } from "./types/nat";
import SLCT from "./types/slct";
import { TRUEFALSE } from "./types/truefalse";
import { TXT_INPUT } from "./types/txt_input";
import { LanguageDropdown } from "@/features/language/LanguageDropdown";
import Passage from "@/features/passage/Passage";
import { Subjective } from "./types/subjective";

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
  AUDIO_TYPE = "AUDIO_TYPE",
  MTQ = "MTQ",
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
  const { examData, dispatch } = useExamData();
  const question = examData.subjects[subjectIndex].questions[index];

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-4",
          (question.passage_desc.length > 0 ||
            question.hi_passage_desc.length > 0) &&
            examData.passage_alignment == "Left"
            ? "md:flex-row"
            : "md:overflow-auto"
        )}
      >
        {(question.passage_desc.length > 0 ||
          question.hi_passage_desc.length > 0) && (
          <Passage
            index={index}
            isActive={isActive}
            subjectIndex={subjectIndex}
          />
        )}
        <Card
          className={cn(
            "w-full border-none pb-[50px]",
            isActive ? "visible" : "hidden",
            question.passage_desc.length > 0 &&
              examData.passage_alignment == "Left"
              ? "md:w-1/2 md:h-[calc(100vh-180px)] overflow-auto"
              : ""
          )}
        >
          <CardHeader className="flex md:flex-row md:items-center justify-between space-y-0 relative px-3 py-1 border-b">
            <div className="pt-1">
              <p className="text-sm text-muted-foreground font-medium">
                Question No. {index + 1}.
              </p>
            </div>
            <div className="flex w-auto items-center gap-2">
              <Badge className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium uppercase px-1">
                {question.question_type}
              </Badge>
              {examData.is_option_based_marking == "1" ? (
                ""
              ) : (
                <>
                  <Badge
                    className="bg-green-100 hover:bg-green-200 text-green-500 font-medium px-1"
                    style={{ width: "-webkit-fill-available" }}
                  >
                    +{question.marks_positive}
                  </Badge>
                  <Badge
                    className="bg-red-100 hover:bg-red-200 text-red-500 font-medium px-1"
                    style={{ width: "-webkit-fill-available" }}
                  >
                    -{question.marks_negative}
                  </Badge>
                </>
              )}

              <LanguageDropdown />
              {examData.is_keyboard_allow ? (
                <Button
                  onClick={() => {
                    dispatch({
                      type: "showHideKeyboard",
                      payload: !examData.studentExamState.showKeyboard,
                    });
                  }}
                  variant={"ghost"}
                  className="px-1 py-1"
                >
                  <Keyboard size={20} />
                </Button>
              ) : (
                ""
              )}
              {parseInt(examData.is_calc_allow) ? (
                <Button
                  onClick={() => {
                    dispatch({
                      type: "showHideCalculator",
                      payload: !examData.studentExamState.showCalculator,
                    });
                  }}
                  variant={"ghost"}
                  className="px-1 py-1"
                >
                  <Calculator size={20} />
                </Button>
              ) : (
                ""
              )}
            </div>
          </CardHeader>
          <CardContent className="px-3 pt-3">
            <MathJax>
              {question.find_hint && question.find_hint != "DOCQ" ? (
                <div className="text-sm font-normal pb-3">
                  <span>Hint: {question.find_hint}</span>
                </div>
              ) : (
                ""
              )}
              <div className="flex flex-col gap-3">
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
                  <MCQ_MULTI_OPTIONS
                    subjectIndex={subjectIndex}
                    index={index}
                  />
                )}
                {question.question_type == QuestionType.TXT_INPUT && (
                  <TXT_INPUT subjectIndex={subjectIndex} index={index} />
                )}
                {question.question_type == QuestionType.FILL_BLANKS && (
                  <FILL_BLANKS subjectIndex={subjectIndex} index={index} />
                )}
                {question.question_type == QuestionType.SENTENCE_ARRANGMENT && (
                  <SENTENCE_ARRANGMENT
                    subjectIndex={subjectIndex}
                    index={index}
                  />
                )}
                {question.question_type == QuestionType.AUDIO_TYPE && (
                  <AUDIO_TYPE subjectIndex={subjectIndex} index={index} />
                )}
                {question.question_type == QuestionType.MTQ && (
                  <MTQ subjectIndex={subjectIndex} index={index} />
                )}
              </div>
            </MathJax>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
