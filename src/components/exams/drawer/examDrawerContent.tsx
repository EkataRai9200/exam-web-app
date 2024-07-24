import { useExamData } from "@/lib/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Answer } from "@/context/ExamContext";
import { cn } from "@/lib/utils";
import { calcTotalQs } from "@/pages/submit/SubmitExam";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle, CheckCircle2 } from "lucide-react";

export const isAnswered = (a: Answer | undefined) => {
  return a && a.ans;
};
export const isMarkedReview = (a: Answer | undefined) => {
  return a && a.review;
};
export const isMarkedAndAnswered = (a: Answer | undefined) => {
  return a && isMarkedReview(a) && isAnswered(a);
};
export const isNotAnswered = (a: Answer | undefined) => {
  if (!a) return false;
  return !isAnswered(a) && !isMarkedReview(a) ? true : false;
};

function ExamDrawerContent() {
  // const [searchParams] = useSearchParams();
  const { examData, dispatch } = useExamData();
  const [searchParams] = useSearchParams();
  return (
    <>
      {examData.authUser && (
        <div className="flex flex-row gap-2 justify-start h-[50px] items-center p-2 bg-white">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={examData.authUser.profile_pic}
              className="object-cover"
            />
            <AvatarFallback>
              {examData.authUser.firstname[0] + examData.authUser.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-sm">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
        </div>
      )}

      <div className="grid grid-cols-3 font-medium text-xs gap-1 justify-between p-2 h-[85px] bg-slate-100">
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-green-600 rounded-md">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isAnswered(a)
              ).length
            }
          </Badge>
          Answered
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-red-600 rounded-md">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isNotAnswered(a)
              ).length
            }
          </Badge>
          Not Answered
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-purple-600 rounded-md">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (v) => isMarkedReview(v)
              ).length
            }
          </Badge>
          Marked
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-purple-600 rounded-md relative">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isMarkedAndAnswered(a)
              ).length
            }
            <span className="bg-green-700 w-2 h-2 flex items-center justify-center rounded-full right-[-3px] bottom-[-3px] absolute">
              <Check size={8} />
            </span>
          </Badge>
          Marked Answer
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 text-dark bg-slate-200 rounded-md">
            {calcTotalQs(examData.subjects) -
              Object.values(examData.studentExamState.student_answers).length}
          </Badge>
          Not Visited
        </div>
      </div>

      <div className="flex max-w-full overflow-x-auto gap-2 p-2 h-[40px] bg-slate-200">
        <h3 className="font-medium text-md">
          {"Section: "}
          {examData.subjects[examData.studentExamState.activeSubject]?.name}
        </h3>
      </div>
      <div className="p-3 pb-0 grid grid-cols-6 auto-rows-max gap-2 mb-5 h-[calc(100%-300px)] overflow-y-auto">
        {examData?.subjects[
          examData.studentExamState.activeSubject
        ]?.questions?.map((_v, i) => {
          const sAns = examData.studentExamState.student_answers[_v._id.$oid];
          const isAns = sAns && isAnswered(sAns) ? true : false;
          const isMarkedForReview = sAns && isMarkedReview(sAns) ? true : false;
          const notAnswered = isNotAnswered(sAns);
          return (
            <div
              key={i}
              onClick={() => {
                dispatch({
                  type: "setActiveQuestion",
                  payload: {
                    index: i,
                    subjectIndex: examData.studentExamState.activeSubject,
                  },
                });
              }}
              className="flex items-start justify-start cursor-pointer"
            >
              <div
                className={cn(
                  "bg-slate-200 w-8 h-8 flex items-center rounded-lg justify-center",
                  notAnswered ? "bg-red-600 text-white" : "",
                  isAns ? "bg-green-600 text-white" : "",
                  isMarkedForReview ? "bg-purple-600 text-white" : "",
                  isMarkedForReview && isAns
                    ? "bg-purple-600 text-white relative"
                    : ""
                )}
              >
                {i + 1}
                {isMarkedForReview && isAns ? (
                  <span className="bg-green-700 w-3 h-3 flex items-center justify-center rounded-full right-[-3px] bottom-[-3px] absolute">
                    <Check size={12} />
                  </span>
                ) : (
                  " "
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={cn(
          "mt-auto flex flex-col justify-center items-center gap-2 p-4 bg-gray-100 h-[100px]"
        )}
      >
        <Button className="bg-green-600 w-full" asChild>
          <Link to={{ pathname: "/submit", search: searchParams.toString() }}>
            Submit Exam
          </Link>
        </Button>
      </div>
    </>
  );
}

export default ExamDrawerContent;
