import { Button } from "@/components/ui/button";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  ClassicEditor,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from "ckeditor5";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "./render";

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
    if (
      examData.studentExamState.activeQuestion === index + 1 ||
      examData.studentExamState.activeQuestion === index
    )
      saveLatestAnswer();
  }, [examData.studentExamState.activeQuestion]);

  const [isSaved, setIsSaved] = React.useState(false);

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
      <CKEditor
        editor={ClassicEditor}
        config={{
          initialData: ans,
          toolbar: {
            items: ["undo", "redo", "|", "bold", "italic"],
          },
          plugins: [
            Bold,
            Essentials,
            Italic,
            Mention,
            Paragraph,
            // SlashCommand,
            Undo,
          ],
        }}
        onChange={(_event, editor) => {
          setContent(editor.getData());
          setIsSaved(false);
          return editor;
        }}
      />

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
