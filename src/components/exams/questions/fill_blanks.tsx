import { Button } from "@/components/ui/button";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "./render";

interface RenderMCQOptionProps extends QuestionTypeProps {}

export function FILL_BLANKS({ index, subjectIndex }: RenderMCQOptionProps) {
  const { examData, dispatch } = useExamData();
  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};

  const [userAnswers, setUserAnswers] = React.useState<Array<string>>(
    (studentResponse.ans as Array<string>) || []
  );

  const saveLatestAnswer = () => {
    const payload = {
      ...studentResponse,
      ans: userAnswers,
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
    setIsSaved(false);
  }, [userAnswers]);

  useEffect(() => {
    let els = document.querySelectorAll(
      `.filled-blank-input-${question._id.$oid}`
    );
    els.forEach((el) => {
      el.addEventListener("change", (e: any) => {
        const blank = question.blanks?.filter(
          (b) => b.id === parseInt(e.target.getAttribute("data-blank"))
        )[0];
        const charIndex = parseInt(e.target.getAttribute("data-char"));

        if (!blank) return;

        const charVal = e.target.value as string;
        const ansString = (
          (studentResponse.ans && studentResponse.ans[blank.id]) ||
          ""
        ).split("");
        ansString[charIndex] = charVal.toUpperCase();

        // TODO: still not working fine, cannot populate data on page load !, doesnt provides latest userAns on change
        const newAnsArr = [...userAnswers];
        newAnsArr[blank.id] = ansString.join("");
        setUserAnswers(newAnsArr);
        console.log(userAnswers, newAnsArr, blank, ansString);
      });
      const inputEl = el as HTMLInputElement;
      inputEl.value = inputEl.value.toUpperCase();
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("input", () => {});
      });
    };
  }, []);

  const [isSaved, setIsSaved] = React.useState(false);

  const replacePlaceholdersWithInputs = (html: string) => {
    const placeholderPattern = /{option_(\d+)}/g;
    let match;
    let result = [];
    let lastIndex = 0;

    // Loop through the HTML content and replace placeholders
    while ((match = placeholderPattern.exec(html)) !== null) {
      const index = match[1]; // Get the number from {option_n}

      if (!question.blanks) return html;

      const blank:
        | undefined
        | { pre: string; post: string; char_count: number; id: number } =
        question.blanks.filter((b) => b.id === parseInt(index))[0];

      // Push the text before the current placeholder
      result.push(html.slice(lastIndex, match.index));

      blank &&
        blank.pre.split("").map((char) => {
          result.push(`<span class="text-sm bg-gray-200 inline-flex justify-center items-center border border-gray-300 h-6 w-6">
          ${char}
              </span>`);
        });

      result.push('<span class="inline-flex">');
      {
        blank &&
          Array.from({ length: blank.char_count }).map((_v, charIndex) => {
            result.push(`<input
              class="border w-7 h-7 p-0 text-sm uppercase text-center hover:ring-0 hover:ring-offset-0 filled-blank-input-${question._id.$oid}"
              maxLength="1"
              data-blank="${blank.id}"
              data-char="${charIndex}"
            />`);
          });
      }
      result.push("</span>");

      blank &&
        blank.post.split("").map((char) => {
          result.push(`<span class="text-sm bg-gray-200 inline-flex justify-center items-center border border-gray-300 h-6 w-6">
          ${char}
              </span>`);
        });

      lastIndex = placeholderPattern.lastIndex;
    }

    // Push the remaining part of the HTML after the last placeholder
    result.push(html.slice(lastIndex));

    return result.join("");
  };

  const htmlWithInputs = replacePlaceholdersWithInputs(
    activeLang == "EN" ? question?.question ?? "" : question?.hi_question ?? ""
  );

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlWithInputs,
        }}
      ></div>
      <div>
        <span>{userAnswers.length}</span>
        {userAnswers.map((a) => (
          <div>
            {a} <br />
          </div>
        ))}
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
