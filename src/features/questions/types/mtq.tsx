import { Checkbox } from "@/components/ui/checkbox";
import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";
import React, { useEffect } from "react";
import { QuestionTypeProps } from "../render";

interface RenderMTQOptionProps extends QuestionTypeProps {}

export interface MTQStudentAnsArray {
  a: Array<any>;
  b: Array<any>;
  c: Array<any>;
  d: Array<any>;
}

export const mapResponseAnswersToStudentAnsArray = (
  response: MTQStudentAnsArray
) => {
  const _oldAns = response ?? {};
  const newAns = [
    Array(4).fill("_"),
    Array(4).fill("_"),
    Array(4).fill("_"),
    Array(4).fill("_"),
  ];

  Object.keys(_oldAns).map((k, i) => {
    newAns[i].map((_a, j) => {
      newAns[i][j] =
        _oldAns[k as keyof MTQStudentAnsArray].filter((x) => {
          return String.fromCharCode(80 + j).toLowerCase() == x;
        }).length > 0
          ? String.fromCharCode(80 + j).toLowerCase()
          : "_";
    });
  });

  return newAns;
};

export function MTQ({ index, subjectIndex }: RenderMTQOptionProps) {
  const { examData, dispatch } = useExamData();
  const [options, setOptions] = React.useState<Array<string | undefined>>([]);
  const [options2, setOptions2] = React.useState<Array<string | undefined>>([]);
  const [ansArr, setAnsArr] = React.useState([
    Array(4).fill("_"),
    Array(4).fill("_"),
    Array(4).fill("_"),
    Array(4).fill("_"),
  ]);

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;
  const activeAns = examData.studentExamState.activeAnswer;

  React.useEffect(() => {
    if (activeLang == "EN") {
      const enOptions = [
        question?.opt1,
        question?.opt2,
        question?.opt3,
        question?.opt4,
      ];
      if (question?.opt5) enOptions.push(question?.opt5);
      setOptions(enOptions);

      const enOptions2 = [
        question?.pques,
        question?.qques,
        question?.rques,
        question?.sques,
      ];
      if (question?.tques) enOptions2.push(question?.tques);
      setOptions2(enOptions2);

      if (typeof activeAns == "object") {
        const _arr = [
          Array(4).fill("_"),
          Array(4).fill("_"),
          Array(4).fill("_"),
          Array(4).fill("_"),
        ];

        const _oldAns = (activeAns as MTQStudentAnsArray) ?? {};

        Object.keys(_oldAns).map((k, i) => {
          _arr[i].map((_a, j) => {
            _arr[i][j] =
              _oldAns[k as keyof MTQStudentAnsArray].filter((x) => {
                return String.fromCharCode(80 + j).toLowerCase() == x;
              }).length > 0
                ? String.fromCharCode(80 + j).toLowerCase()
                : "_";
          });
        });

        setAnsArr(_arr);
      }
    } else {
      if (question?.hi_opt1) {
        const hiOptions = [
          question?.hi_opt1,
          question?.hi_opt2,
          question?.hi_opt3,
          question?.hi_opt4,
        ];
        if (question?.hi_opt5) hiOptions.push(question?.hi_opt5);
      } else {
        setOptions([]);
      }
    }
  }, [examData]);

  const markAnswer = (i: number, j: number) => {
    const char2 = String.fromCharCode(80 + j);

    let newAns = ansArr;
    if (!newAns[i][j] || newAns[i][j] == "_")
      newAns[i][j] = char2.toLowerCase();
    else newAns[i][j] = "_";
    dispatch({
      type: "setActiveAnswer",
      payload: newAns,
    });
  };

  useEffect(() => {
    if (
      (window as any).MathJax &&
      typeof (window.MathJax as any).typesetPromise == "function"
    )
      (window.MathJax as any).typesetPromise();
  }, [options]);

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

      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          {options.map((_v, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "w-full p-1 flex items-center gap-2  relative border  bg-white "
                )}
              >
                <div
                  className={cn(
                    "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                {_v && (
                  <div
                    className="no-tailwindcss-base ck-editor"
                    dangerouslySetInnerHTML={{ __html: _v }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col">
          {options2.map((_v, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "w-full p-1 flex items-center gap-2  relative border  bg-white "
                )}
              >
                <div
                  className={cn(
                    "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full"
                  )}
                >
                  {String.fromCharCode(80 + i)}
                </div>
                {_v && (
                  <div
                    className="no-tailwindcss-base ck-editor"
                    dangerouslySetInnerHTML={{ __html: _v }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {options.map((_v, i) => {
        const char = String.fromCharCode(65 + i);
        return (
          <div
            key={i}
            className={cn(
              "w-full rounded-lg p-1 flex items-center gap-2 relative  bg-white"
            )}
          >
            <div
              className={cn(
                "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full"
              )}
            >
              {char}
            </div>

            <div className="flex gap-2">
              {options2.map((_v, j) => {
                const char2 = String.fromCharCode(80 + j);
                const status =
                  ansArr[i] && ansArr[i][j] == char2.toLowerCase()
                    ? "answered"
                    : "pending";
                return (
                  <div
                    key={`checkbox_${question._id.$oid}_${char}_${char2}`}
                    className={cn(
                      "w-full p-1 flex items-center gap-2 cursor-pointer  relative border  bg-white "
                    )}
                    onClick={() => markAnswer(i, j)}
                  >
                    <Checkbox
                      className={
                        status == "answered"
                          ? "border-green-600 data-[state=checked]:bg-green-600"
                          : ""
                      }
                      checked={status == "answered"}
                    />
                    <span
                      className={cn(
                        "border w-7 h-7 text-sm font-medium flex items-center justify-center text-center rounded-full"
                      )}
                    >
                      {char2}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* <div>{isSaved ? "Saved" : "Not Saved"}</div> */}
    </>
  );
}
