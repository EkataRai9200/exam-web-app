import { Button } from "@/components/ui/button";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { CheckCircle, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { QuestionTypeProps } from "./render";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitize } from "@/lib/utils";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function Subjective({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans = studentResponse?.ans ?? "";

  const [content, setContent] = React.useState("");

  const saveLatestAnswer = () => {
    const payload = {
      ...studentResponse,
      ans: content,
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

  useEffect(() => {
    // TODO: save answer automaticaly when leaving question window
    // if (
    //   examData.studentExamState.activeSubject === subjectIndex &&
    //   examData.studentExamState.activeQuestion === index
    // ) {
    //   saveLatestAnswer();
    // }
    setIsSaved(false);
  }, [content]);

  const [isSaved, setIsSaved] = React.useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(sanitize(event.target.value.trim()));
  };

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
      <div className="mt-5 grid w-full gap-2">
        <Label htmlFor="message">Answer</Label>
        <Textarea
          onChange={handleTextChange}
          onBlur={saveLatestAnswer}
          placeholder="Type your message here."
          rows={5}
          id="message"
        />
        <div>
          {/* <Button
            type="button"
            className="w-full md:w-auto"
            variant={"secondary"}
          >
            <Upload size={15} className="me-2" /> Upload File
          </Button> */}
          {/* <p className="text-xs text-muted-foreground italic">
            PDF, JPG, JPEG, PNG files are accepted. Max File Size: 20MB
          </p> */}
        </div>
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
