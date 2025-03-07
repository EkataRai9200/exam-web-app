import { MAQ } from "@/components/exams/questions/maq";
import { MCQ } from "@/components/exams/questions/mcq";
import { Card, CardContent } from "@/components/ui/card";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { MathJax } from "better-react-mathjax";
import CATPassage from "../passage/CATPassage";
import { AUDIO_TYPE } from "./AUDIO_TYPE";
import { SENTENCE_ARRANGMENT } from "./SENTENCE_ARRANGMENT";
import { FILL_BLANKS } from "./fill_blanks";
import { MCQ_MULTI_OPTIONS } from "./mcq_multi_options";
import { MTQ } from "./mtq";
import MULTI_SLCT from "./multi_slct";
import { NAT } from "./nat";
import SLCT from "./slct";
import { Subjective } from "./subjective";
import { TRUEFALSE } from "./truefalse";
import { TXT_INPUT } from "./txt_input";
import { CATMCQ } from "./CATmcq";

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

interface CATRenderQuestionProps {
  index: number;
  isActive: boolean;
  setActive: (value: any) => void;
  subjectIndex: number;
}

export interface QuestionTypeProps {
  index: number;
  subjectIndex: number;
}

export function CATRenderQuestion({
  index,
  isActive,
  subjectIndex,
}: CATRenderQuestionProps) {
  const { examData } = useExamData();
  const question = examData.subjects[subjectIndex].questions[index];

  return (
    <>
      <div className="bg-white border-b-2 py-1 items-center px-2 flex justify-between">
        <p className="block text-sm font-bold w-3/6">
          Question No. {index + 1}.
        </p>
        <div className="flex items-center">
          {/* <p>{question.question_type}</p> */}
          {examData.is_option_based_marking == "1" ? (
            ""
          ) : (
            <>
              <p className="text-xs w-full">
                Marks for correct answer:{" "}
                <span className="text-green-500">
                  {question.marks_positive}
                </span>{" "}
                | Negative Marks:{" "}
                <span className="text-red-500">{question.marks_negative}</span>
              </p>
            </>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-0 px-0 flex-1 h-full overflow-y-scroll",
          question.passage_desc.length > 0 ||
            (question.hi_passage_desc.length > 0 &&
              examData.passage_alignment == "Left")
            ? "md:flex-row"
            : ""
        )}
      >
        {(question.passage_desc.length > 0 ||
          question.hi_passage_desc.length > 0) && (
          <CATPassage
            index={index}
            isActive={isActive}
            subjectIndex={subjectIndex}
          />
        )}
        <Card
          className={cn(
            "w-full border-none",
            isActive ? "visible" : "hidden",
            question.passage_desc.length > 0 &&
              examData.passage_alignment == "Left"
              ? "md:w-1/2"
              : ""
          )}
        >
          <CardContent className="px-3 pt-3 h-full">
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
                  <CATMCQ subjectIndex={subjectIndex} index={index} />
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
