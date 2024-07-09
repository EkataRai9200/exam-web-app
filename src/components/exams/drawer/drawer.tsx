import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useExamData } from "@/lib/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export function ExamDrawer() {
  const [searchParams] = useSearchParams();

  const { examData, dispatch } = useExamData();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="default" size="icon" className="bg-gray-800 w-8 h-8">
          <Menu size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-screen w-full relative">
          {examData.authUser && (
            <div className="flex flex-row gap-2 justify-start items-center p-2 bg-gray-100">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {examData.authUser.firstname[0] +
                    examData.authUser.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
            </div>
          )}
          <DrawerClose asChild>
            <Button
              variant={"default"}
              size={"icon"}
              className="absolute right-3 top-3 w-8 h-8"
            >
              <X size={12} />
            </Button>
          </DrawerClose>
          <div className="flex max-w-full overflow-x-auto gap-2 p-2 bg-gray-200">
            <h3 className="font-medium text-md">
              {"Section: "}
              {examData.subjects[examData.studentExamState.activeSubject]?.name}
            </h3>
          </div>
          <div className="p-3 pb-0 grid grid-cols-6 auto-rows-max gap-2 mb-5 h-[60vh] overflow-y-auto">
            {examData?.subjects[
              examData.studentExamState.activeSubject
            ]?.questions.map((_v, i) => {
              const isAnswered = examData.studentExamState.student_answers[
                _v._id.$oid
              ]
                ? true
                : false;
              const isMarkedForReview =
                examData.studentExamState.marked_for_review.filter(
                  (reviewAns, reviewAnsIndex) => {
                    return reviewAns.index == i;
                  }
                ).length > 0
                  ? true
                  : false;
              const isActiveQues =
                i === examData.studentExamState.activeQuestion;
              return (
                <div
                  key={i}
                  onClick={() => {
                    dispatch({
                      type: "setActiveQuestion",
                      payload: i,
                    });
                  }}
                  className="flex items-start justify-start cursor-pointer"
                >
                  <div
                    className={cn(
                      "bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center",
                      isAnswered ? "bg-green-500 text-white" : "",
                      isMarkedForReview ? "bg-yellow-500 text-white" : "",
                      isActiveQues ? "bg-gray-500 text-white" : ""
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
                {Object.keys(examData.studentExamState.student_answers).length}
              </Badge>
              Answered
            </div>
            <div className="flex gap-1 items-center">
              <Badge className="min-w-5 justify-center px-1 bg-red-600">
                {parseInt(examData.total_qs) -
                  Object.keys(examData.studentExamState.student_answers).length}
              </Badge>
              Not Answered
            </div>
            <div className="flex gap-1 items-center">
              <Badge className="min-w-5 justify-center px-1 bg-yellow-600">
                {examData.studentExamState.marked_for_review.length}
              </Badge>
              Marked
            </div>
            <div className="flex gap-1 items-center">
              <Badge className="min-w-5 justify-center px-1 bg-purple-600">
                {Math.min(
                  examData.studentExamState.marked_for_review.length,
                  Object.keys(examData.studentExamState.student_answers).length
                )}
              </Badge>
              Marked Answer
            </div>
            <div className="flex gap-1 items-center">
              <Badge className="min-w-5 justify-center px-1 bg-gray-600">
                10
              </Badge>
              Not Visited
            </div>
          </div>
          <DrawerFooter>
            <Button className="bg-green-600" asChild>
              <Link
                to={{ pathname: "/submit", search: searchParams.toString() }}
              >
                Submit Exam
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
