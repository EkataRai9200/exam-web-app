import { useExamData } from "@/lib/hooks";

import CountdownTimer from "@/components/exams/timer/countDownTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authenticateToken, getTestDetails } from "../start/StartPage";

export function TableDemo() {
  const { examData, dispatch } = useExamData();

  return (
    <Card className="w-full">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Questions</TableCell>
            <TableCell>
              <Badge className="bg-gray-600">{examData.total_qs}</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Answered Questions</TableCell>
            <TableCell>
              <Badge className="bg-green-600">10</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">UnAnswered Questions</TableCell>
            <TableCell>
              <Badge className="bg-red-600">20</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Marked for Review</TableCell>
            <TableCell>
              <Badge className="bg-yellow-600">10</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

export function TableDemo2() {
  return (
    <Card className="w-full">
      <CardContent className="px-3 py-2">
        <h3 className="text-lg font-medium mb-2">Subject 1</h3>
        <div className="grid grid-cols-3 font-medium text-xs gap-1 justify-between tracking-tight">
          <div>
            <Badge className="px-1 bg-green-600">100</Badge> Answered
          </div>
          <div>
            <Badge className="px-1 bg-red-600">100</Badge> UnAnswered
          </div>
          <div>
            <Badge className="px-1 bg-yellow-600">100</Badge> Marked
          </div>
          <div>
            <Badge className="px-1 bg-purple-600">100</Badge> Marked Answer
          </div>
          <div>
            <Badge className="px-1 bg-gray-600">10</Badge> Not Visited
          </div>
        </div>{" "}
      </CardContent>
    </Card>
  );
}

function SubmitExam() {
  const { examData, dispatch } = useExamData();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (!examData.test_name || examData.test_name == "") {
      authenticateToken(searchParams.get("token") ?? "").then((authUser) => {
        getTestDetails(
          searchParams.get("token") ?? "",
          authUser.webtesttoken
        ).then((examData) => {
          dispatch({ type: "init", payload: examData });
        });
      });
    }
  }, []);

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted p-2 md:gap-8 md:p-10">
      <div className="flex items-center justify-between p-2">
        <h5 className="scroll-m-20 text-lg font-medium tracking-tight">
          {examData.test_name}
        </h5>
        <div className="flex gap-4">
          {examData.subjects.length > 0 ? (
            <CountdownTimer
              startTime={examData.studentExamState.start_time}
              initialSeconds={parseInt(examData.time_limit) * 60}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <TableDemo />
        <div className="flex max-w-full overflow-x-auto gap-2 p-1 bg-gray-200">
          <Button size={"sm"} variant={"default"}>
            Subject 1
          </Button>
          <Button size={"sm"} variant={"outline"}>
            Subject 2
          </Button>
          <Button size={"sm"} variant={"outline"}>
            Subject 3
          </Button>
        </div>
        <TableDemo2 />
      </div>
      <div className="flex flex-col justify-between gap-4 bottom-0 w-full p-2">
        <Button
          className="bg-green-600 w-full"
          //   onClick={() => setActiveTab("submitExam")}
          size={"lg"}
          asChild
        >
          <Link
            to={{
              pathname: "/take",
              search: searchParams.toString(),
            }}
          >
            Submit Exam
          </Link>
        </Button>
        <Button className="bg-gray-600 w-full" size={"lg"} asChild>
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
    </main>
  );
}

export default SubmitExam;
