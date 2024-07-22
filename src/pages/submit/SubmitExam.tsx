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
import { saveTest } from "@/lib/utils";
import { toast } from "sonner";
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
            <TableCell>
              <Badge className="bg-gray-600">{totalQs}</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Answered Questions</TableCell>
            <TableCell>
              <Badge className="bg-green-600">
                {
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isAnswered(a)).length
                }
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">UnAnswered Questions</TableCell>
            <TableCell>
              <Badge className="bg-red-600">
                {totalQs -
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isAnswered(a)).length}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Marked for Review</TableCell>
            <TableCell>
              <Badge className="bg-yellow-600">
                {
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isMarkedReview(a)).length
                }
              </Badge>
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
        <h3 className="text-lg font-medium mb-2">{s.name}</h3>
        <div className="grid grid-cols-3 font-medium text-xs gap-1 justify-between tracking-tight">
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-gray-600">
              {s.questions.length}
            </Badge>
            Total Questions
          </div>
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-green-600">
              {
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length
              }
            </Badge>
            Answered
          </div>
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-red-600">
              {s.questions.length -
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length}
            </Badge>
            UnAnswered
          </div>
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-yellow-600">
              {
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isMarkedReview(a)
                ).length
              }
            </Badge>
            Marked
          </div>
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-purple-600">
              {
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) =>
                    a.sub_id == s.sub_id && isMarkedReview(a) && isAnswered(a)
                ).length
              }
            </Badge>
            Marked Answer
          </div>
          <div>
            <Badge className="min-w-5 max-w-fit flex justify-center  bg-gray-200 text-black">
              {
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && a.review
                ).length
              }
            </Badge>
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
