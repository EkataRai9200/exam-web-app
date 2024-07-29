import { useExamData } from "@/lib/hooks";

import CountdownTimer from "@/components/exams/timer/countDownTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ExamDetailData } from "@/context/ExamContext";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  isAnswered,
  isMarkedReview,
} from "@/components/exams/drawer/examDrawerContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { toast } from "sonner";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import NotVisited from "@/components/exams/status/NotVisited";
import Answered from "@/components/exams/status/Answered";
import NotAnswered from "@/components/exams/status/NotAnswered";
import Marked from "@/components/exams/status/Marked";
import MarkedAnswered from "@/components/exams/status/MarkedAnswered";
export const calcTotalQs = (subjects: ExamDetailData["subjects"]): number => {
  return subjects.reduce((acc, v) => acc + v.questions.length, 0);
};

export function TableDemo() {
  const { examData } = useExamData();

  const totalQs = calcTotalQs(examData.subjects);

  return (
    <Card className="w-full">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Questions</TableCell>
            <TableCell>{totalQs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Answered Questions</TableCell>
            <TableCell>
              <Answered
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isAnswered(a)).length
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">UnAnswered Questions</TableCell>
            <TableCell>
              <NotAnswered
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => !isAnswered(a) && !isMarkedReview(a)).length
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Not Visited Questions</TableCell>
            <TableCell>
              <NotVisited
                value={totalQs - Object.values(examData.subjects).length}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Marked for Review</TableCell>
            <TableCell>
              <Marked
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isMarkedReview(a)).length
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

export function SubjectWiseOverview() {
  const { examData } = useExamData();
  const [api, setApi] = React.useState<CarouselApi>();
  const [_current, setCurrent] = React.useState(0);
  const [_count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <div className="flex max-w-full overflow-x-auto gap-2 p-1 bg-gray-200">
        {examData.subjects.map((s, i) => (
          <Button
            key={`button_${s.sub_id}`}
            size={"sm"}
            variant={i === api?.selectedScrollSnap() ? "default" : "outline"}
            onClick={() => api?.scrollTo(i)}
          >
            {s.name}
          </Button>
        ))}
      </div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {examData.subjects.map((s) => (
            <CarouselItem>
              <SubjectOverviewBlock subject={s} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

export function SubjectOverviewBlock({
  subject: s,
}: {
  subject: ExamDetailData["subjects"][0];
}) {
  const { examData } = useExamData();
  return (
    <Card key={`card_${s.sub_id}`} className="w-full">
      <CardContent className="px-3 py-2">
        <h3 className="text-md font-medium mb-2 border-b">{s.name}</h3>
        <div className="grid grid-cols-2 font-medium text-xs gap-2 justify-between tracking-tight">
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 flex items-center justify-center bg-gray-100">
              {s.questions.length}
            </div>
            Total Questions
          </div>
          <div className="flex gap-2 items-center">
            <Answered
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length
              }
            />
            Answered
          </div>
          <div className="flex gap-2 items-center">
            <NotAnswered
              value={
                s.questions.length -
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length
              }
            />
            UnAnswered
          </div>
          <div className="flex gap-2 items-center">
            <Marked
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isMarkedReview(a)
                ).length
              }
            />
            Marked
          </div>
          <div className="flex gap-2 items-center">
            <MarkedAnswered
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) =>
                    a.sub_id == s.sub_id && isMarkedReview(a) && isAnswered(a)
                ).length
              }
            />
            Marked Answer
          </div>
          <div className="flex gap-2 items-center">
            <NotVisited
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && a.review
                ).length
              }
            />
            Not Visited
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmitExam() {
  const { examData, dispatch } = useExamData();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!examData.test_name || examData.test_name == "") {
      navigate({
        pathname: "/start",
        search: searchParams.toString(),
      });
    }
  }, []);

  const onTestTimerExpires = () => {
    toast.dismiss();
    toast.error("Timer Expired", { position: "top-center" });
    dispatch({ type: "submit_exam", payload: examData });
  };
  const MySwal = withReactContent(Swal);

  return (
    <main className="bg-muted">
      <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-2 md:gap-8 md:p-10 w-full md:w-1/2 m-auto">
        <div className="flex items-center justify-between p-2">
          <h5 className="scroll-m-20 text-lg font-medium tracking-tight">
            {examData.test_name}
          </h5>
          <div className="flex gap-4">
            {examData.subjects.length > 0 && examData.start_date ? (
              <CountdownTimer
                startTime={examData.start_date}
                initialSeconds={parseInt(examData.test_time_limit) * 60}
                onExpire={onTestTimerExpires}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <TableDemo />
          <SubjectWiseOverview />
        </div>
        <div className="flex flex-col md:flex-col justify-between gap-4 bottom-0 w-full p-2">
          <Button
            className="bg-green-600 w-full"
            size={"lg"}
            onClick={() => {
              dispatch({ type: "submit_exam", payload: examData });
              MySwal.fire({
                title: "Your exam has been submitted.",
                showDenyButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                backdrop: "rgba(0, 0, 0, 0.5)",
                confirmButtonText: "Close Window",
              }).then((_result) => {
                if (typeof (window as any).Android != "undefined") {
                  (window as any).Android.testCompletedCallback();
                } else {
                  window.close();
                }
              });
              setTimeout(() => {
                if (typeof (window as any).Android != "undefined") {
                  (window as any).Android.testCompletedCallback();
                } else {
                  window.close();
                }
              }, 1500);
            }}
          >
            Submit Exam
          </Button>
          <Button variant={"outline"} className=" w-full" size={"lg"} asChild>
            <Link
              to={{
                pathname: "/take",
                search: searchParams.toString(),
              }}
            >
              Go Back to Questions
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default SubmitExam;
