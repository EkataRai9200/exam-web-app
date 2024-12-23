import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { Check, Mic, MicOff, Trash } from "lucide-react";
import { useReactMediaRecorder } from "react-media-recorder";
import { isAnswered } from "../drawer/examDrawerContent";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function AUDIO_TYPE({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};

  const markAnswer = (url: string) => {
    const payload = {
      ...studentResponse,
      ans: url,
      sub_id: examData.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };
    dispatch({
      type: "markAnswer",
      payload,
    });
    dispatch({
      type: "setActiveAnswer",
      payload: url,
    });
  };

  const removeRecording = () => {
    if (confirm("Do you really want to remove this audio?")) {
      fetch(`${examData.authUser?.api_url}/remove-audio-file/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qid: question._id.$oid,
          file: studentResponse.ans,
          webtesttoken: examData.authUser?.webtesttoken,
        }),
      }).then(async (response) => {
        const json = await response.json();
        if (json.status) {
          clearBlobUrl();
          markAnswer("");
          return json.data;
        } else {
          throw new Error("File Delete failed");
        }
      });
    }
  };
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  const saveRecording = async () => {
    const formData = new FormData();
    let blob = await fetch(mediaBlobUrl ?? "").then((r) => r.blob());
    formData.append("file", blob as any);
    formData.append("qid", question._id.$oid);
    formData.append("webtesttoken", examData.authUser?.webtesttoken ?? "");
    fetch(`${examData.authUser?.api_url}/upload-single-audio-file`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then(async (response) => {
      const json = await response.json();
      if (json.status) {
        markAnswer(json.data.file);
        clearBlobUrl();
        return json.data;
      } else {
        throw new Error("File upload failed");
      }
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
      <div className="mt-5 grid w-full gap-2">
        <Label htmlFor="message">Answer</Label>
        <hr />
        <div className="flex flex-col space-y-4">
          {!mediaBlobUrl && !isAnswered(studentResponse) ? (
            <div className="flex gap-2">
              {status != "recording" ? (
                <Button
                  size={"lg"}
                  className="bg-blue-600"
                  onClick={startRecording}
                >
                  <Mic size={18} className="me-2" /> Start Recording
                </Button>
              ) : (
                <Button
                  size={"lg"}
                  variant={"secondary"}
                  onClick={stopRecording}
                >
                  <MicOff size={18} className="me-2" /> Stop Recording
                </Button>
              )}
            </div>
          ) : (
            <></>
          )}

          {mediaBlobUrl || isAnswered(studentResponse) ? (
            <div className="flex gap-2 items-center mt-2">
              <audio
                src={
                  mediaBlobUrl
                    ? mediaBlobUrl
                    : `${examData.audio_base_url}${studentResponse.ans}`
                }
                controls
                className="w-[300px] max-w-full"
              />
              {mediaBlobUrl ? (
                <>
                  <Button
                    variant={"default"}
                    size={"sm"}
                    className="px-2 h-10"
                    type="button"
                    onClick={() => saveRecording()}
                  >
                    <Check size={18} className="me-2" /> Save
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="px-2 h-10"
                    type="button"
                    onClick={() => clearBlobUrl()}
                  >
                    <Trash size={18} className="me-2" /> Remove
                  </Button>
                </>
              ) : (
                ""
              )}
              {!mediaBlobUrl && isAnswered(studentResponse) ? (
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  className="px-2 h-10"
                  type="button"
                  onClick={() => removeRecording()}
                >
                  <Trash size={18} className="me-2" /> Remove
                </Button>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
