import { useExamData } from "@/lib/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Answer } from "@/context/ExamContext";
import { cn } from "@/lib/utils";
import { calcTotalQs } from "@/pages/submit/SubmitExam";

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
  return (
    <>
      {examData.authUser && (
        <div className="flex flex-row gap-2 justify-start items-center p-2 bg-gray-100">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {examData.authUser.firstname[0] + examData.authUser.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
        </div>
      )}
      <div className="flex max-w-full overflow-x-auto gap-2 p-2 bg-gray-200">
        <h3 className="font-medium text-md">
          {"Section: "}
          {examData.subjects[examData.studentExamState.activeSubject]?.name}
        </h3>
      </div>
      <div className="p-3 pb-0 grid grid-cols-6 auto-rows-max gap-2 mb-5 h-[60vh] overflow-y-auto">
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
                  "bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center",
                  notAnswered ? "bg-red-600 text-white" : "",
                  isAns ? "bg-green-600 text-white" : "",
                  isMarkedForReview ? "bg-yellow-600 text-white" : "",
                  isMarkedForReview && isAns ? "bg-purple-600 text-white" : ""
                )}
              >
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 font-medium text-xs gap-2 justify-between p-2 bg-gray-200">
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-green-600">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isAnswered(a)
              ).length
            }
          </Badge>
          Answered
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-red-600">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isNotAnswered(a)
              ).length
            }
          </Badge>
          Not Answered
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-yellow-600">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (v) => isMarkedReview(v)
              ).length
            }
          </Badge>
          Marked
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-purple-600">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isMarkedAndAnswered(a)
              ).length
            }
          </Badge>
          Marked Answer
        </div>
        <div className="flex gap-1 items-center">
          <Badge className="min-w-5 justify-center px-1 bg-gray-600">
            {calcTotalQs(examData.subjects) -
              Object.values(examData.studentExamState.student_answers).length}
          </Badge>
          Not Visited
        </div>
      </div>
    </>
  );
}

export default ExamDrawerContent;
