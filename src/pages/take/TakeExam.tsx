import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronLeft, Flag, FlagOff, Menu, Trash, X } from "lucide-react";

import { RenderQuestion } from "@/components/exams/questions/render";
import CountdownTimer from "@/components/exams/timer/countDownTimer";
import { Badge } from "@/components/ui/badge";

import { authenticateToken, getTestDetails } from "@/pages/start/StartPage";
import { useSearchParams } from "react-router-dom";
import { ExamDrawer } from "@/components/exams/drawer/drawer";
import { useExamData } from "@/lib/hooks";
import Loader from "@/components/blocks/Loader";

export function TakeExam() {
  const { examData, dispatch, fetchExamData } = useExamData();

  const activeSubject = examData.studentExamState.activeSubject ?? -1;
  const activeQuestion =
    activeSubject >= 0 ? examData.studentExamState.activeQuestion ?? -1 : -1;

  const setActiveSubject = (index: number) => {
    dispatch({ type: "setActiveSubject", payload: index });
  };
  const setActiveQuestion = (index: number) => {
    dispatch({ type: "setActiveQuestion", payload: index });
  };

  const [searchParams] = useSearchParams();

  const handleNextQuestion = () => {
    if (
      activeQuestion <
      examData.subjects[examData.studentExamState.activeSubject].questions
        .length -
        1
    ) {
      setActiveQuestion(activeQuestion + 1);
    } else if (
      examData.studentExamState.activeSubject + 1 <=
      examData.subjects.length - 1
    ) {
      setActiveSubject(examData.studentExamState.activeSubject + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
    } else if (examData.studentExamState.activeSubject > 0) {
      setActiveSubject(examData.studentExamState.activeSubject - 1);
    }
  };

  React.useEffect(() => {
    setActiveQuestion(0);
  }, [examData.studentExamState.activeSubject]);

  React.useEffect(() => {
    console.log("====================================");
    console.log(examData);
    console.log("====================================");
  }, [examData]);

  React.useEffect(() => {
    if (!examData.test_name || examData.test_name == "") {
      fetchExamData().then((data) => {
        dispatch({ type: "init", payload: data });
        if (data.start_date)
          dispatch({ type: "start_exam", payload: data.start_date });
      });
    }
  }, []);
  return (
    <>
      {examData.subjects.length > 0 ? (
        <div className="flex min-h-screen w-full flex-col">
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-0 bg-muted md:gap-8 md:p-10">
            <div className="flex justify-between items-center p-2">
              <h5 className="scroll-m-20 text-md font-medium tracking-tight">
                {examData.test_name}
              </h5>
              <div className="flex gap-4">
                {parseInt(examData.test_time_limit) > 0 &&
                  examData.studentExamState.start_date > 0 && (
                    <CountdownTimer
                      startTime={examData.studentExamState.start_date}
                      initialSeconds={parseInt(examData.test_time_limit) * 60}
                    />
                  )}

                <ExamDrawer key={2} />
                {/* <Button className="bg-blue-600">Submit</Button> */}
              </div>
            </div>

            <div className="flex max-w-full overflow-x-auto gap-2 py-2 px-2 bg-gray-200">
              {examData.subjects.map((v, i) => {
                return (
                  <Button
                    key={v.sub_id}
                    size={"sm"}
                    variant={activeSubject == i ? "default" : "outline"}
                    onClick={() => setActiveSubject(i)}
                  >
                    {v.name}
                  </Button>
                );
              })}
            </div>
            {/* TODO: yet to be implemented */}
            {examData.subjects.length > 0 &&
              activeSubject >= 0 &&
              examData.subject_time == "yes" && (
                <div className="flex bg-gray-100 items-center justify-start gap-2 p-2">
                  <p className="text-xs font-medium">
                    Time Left For Subject :{" "}
                  </p>
                  <CountdownTimer
                    startTime={examData.studentExamState.start_date}
                    initialSeconds={
                      parseInt(
                        examData?.subjects[
                          examData.studentExamState.activeSubject
                        ]?.subject_time
                      ) * 60
                    }
                  />
                </div>
              )}

            {examData.subjects.length > 0 && (
              <>
                <div className="p-2 mb-[100px]">
                  {examData.subjects[
                    examData.studentExamState.activeSubject
                  ]?.questions.map((v, i) => {
                    return (
                      <RenderQuestion
                        index={i}
                        subjectIndex={activeSubject}
                        isActive={activeQuestion == i}
                        setActive={setActiveQuestion}
                        key={v._id.$oid}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </main>
          <div className="flex justify-between gap-2 items-center fixed bg-gray-100 bottom-0 w-full p-2">
            <div className="flex justify-start gap-2 w-full p-2">
              <Button
                size={"icon"}
                variant="outline"
                onClick={handlePreviousQuestion}
              >
                <ChevronLeft />
              </Button>
              <Button
                size={"icon"}
                variant="default"
                className="bg-gray-300 text-red-500"
                onClick={() => {
                  dispatch({
                    type: "deleteAnswer",
                    payload:
                      examData.subjects[activeSubject].questions[activeQuestion]
                        ._id.$oid,
                  });
                }}
              >
                <Trash size={18} />
              </Button>
              {examData.studentExamState.marked_for_review.filter((v, i) => {
                return v.index == activeQuestion;
              }).length > 0 ? (
                <Button
                  size={"icon"}
                  variant="default"
                  className="bg-yellow-400 text-dark"
                  onClick={() => {
                    dispatch({
                      type: "removeMarkForReview",
                      payload: {
                        index: activeQuestion,
                        subjectIndex: activeSubject,
                      },
                    });
                  }}
                >
                  <FlagOff size={18} />
                </Button>
              ) : (
                <Button
                  size={"icon"}
                  variant="default"
                  className="bg-yellow-400 text-dark"
                  onClick={() => {
                    dispatch({
                      type: "markForReview",
                      payload: {
                        index: activeQuestion,
                        subjectIndex: activeSubject,
                      },
                    });
                  }}
                >
                  <Flag size={18} />
                </Button>
              )}
            </div>
            {examData.subjects.length >= 0 && (
              <>
                {activeSubject == examData.subjects.length - 1 &&
                activeQuestion ==
                  examData.subjects[examData.studentExamState.activeSubject]
                    .questions.length -
                    1 ? (
                  <Button
                    onClick={() => {
                      // TODO: submit exam
                    }}
                    className="bg-green-600 hover:bg-green-800"
                    size={"lg"}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} size={"lg"}>
                    Next
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <Loader visible={true} />
      )}
    </>
  );
}
