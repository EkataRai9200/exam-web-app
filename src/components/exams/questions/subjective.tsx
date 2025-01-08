import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn, sanitize } from "@/lib/utils";
import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function Subjective({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const activeAnswer = examData.studentExamState.activeAnswer;

  const [subjectiveimages, setSubjectiveimages] = React.useState<string[]>(
    activeAnswer?.subjectiveimages ?? []
  );

  const [wordCount, setWordCount] = React.useState(0);
  const [content, setContent] = React.useState(activeAnswer?.content ?? "");

  const markAnswer = () => {
    dispatch({
      type: "setActiveAnswer",
      payload: {
        content,
        subjectiveimages,
      },
    });
  };
  useEffect(() => {
    markAnswer();
  }, [content, subjectiveimages]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(sanitize(event.target.value.trim()));
    const words = content.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as any;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("webtesttoken", examData.authUser?.webtesttoken ?? "");
    fetch(
      `${examData.authUser?.api_url}/save-subjective-image/${question._id.$oid}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    ).then(async (response) => {
      const json = await response.json();
      if (json.status) {
        setSubjectiveimages([...subjectiveimages, json.filename]);
        return json.data;
      } else {
        throw new Error("File upload failed");
      }
    });
  };

  const removeImage = (index: number) => {
    if (confirm("Do you really want to remove this image?")) {
      if (subjectiveimages[index] == null) {
        setSubjectiveimages(subjectiveimages.filter((_v, i) => i !== index));
        return false;
      }
      fetch(`${examData.authUser?.api_url}/remove-image/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qid: question._id.$oid,
          image: subjectiveimages[index],
          webtesttoken: examData.authUser?.webtesttoken,
        }),
      }).then(async (response) => {
        const json = await response.json();
        if (json.status) {
          setSubjectiveimages(subjectiveimages.filter((_v, i) => i !== index));
          // setIsSaved(false);
          return json.data;
        } else {
          throw new Error("File upload failed");
        }
      });
    }
  };

  const questionText =
    activeLang == "EN" ? question?.question : question?.hi_question ?? "";

  return (
    <>
      <div
        className="no-tailwindcss-base ck-editor"
        dangerouslySetInnerHTML={{
          __html: questionText,
        }}
      ></div>
      <div
        className={cn({
          hidden: questionText == "",
        })}
      >
        <div className="mt-5 grid w-full gap-2">
          <div className="flex-row ">   
          <Label htmlFor="message">Answer </Label>
          <div className="float-right">Word Count: {wordCount}</div>
          </div>
        

          <Textarea
            onChange={handleTextChange}
            onBlur={markAnswer}
            placeholder="Type your message here."
            rows={5}
            defaultValue={content}
            id="message"
          />

          <div>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={uploadFile}
            />
            <p className="text-xs text-muted-foreground italic">
              PDF, JPG, JPEG, PNG files are accepted.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {subjectiveimages.map((s, i) => {
            return (
              <div
                className="relative"
                key={`subjective_image_${question._id.$oid}_${i}`}
              >
                <img
                  src={`https://d3bioexaf647f4.cloudfront.net/${s}`}
                  width={60}
                  className="border"
                />
                <Button
                  variant={"ghost"}
                  onClick={() => removeImage(i)}
                  className="text-red-600 px-1 py-0 absolute h-5 top-0 right-0 bg-gray-100"
                >
                  <Trash size={15} />
                </Button>
              </div>
            );
          })}
        </div>
        {/* <div>
          <Button
            disabled={isSaved}
            variant={"outline"}
            className="flex gap-2"
            onClick={markAnswer}
          >
            {isSaved ? (
              <>
                Answer Saved <CheckCircle size={12} />
              </>
            ) : (
              "Save Answer"
            )}
          </Button>
        </div> */}
      </div>
    </>
  );
}
