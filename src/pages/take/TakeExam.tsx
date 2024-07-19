import { Button } from "@/components/ui/button";

import * as React from "react";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Flag,
  FlagOff,
  Trash,
} from "lucide-react";

import { RenderQuestion } from "@/components/exams/questions/render";
import CountdownTimer from "@/components/exams/timer/countDownTimer";

import Loader from "@/components/blocks/Loader";
import { ExamDrawer } from "@/components/exams/drawer/drawer";
import { useExamData } from "@/lib/hooks";
import { cn, saveTest } from "@/lib/utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// modules css
import ExamDrawerContent from "@/components/exams/drawer/examDrawerContent";
import "ckeditor5/ckeditor5.css";
import "react-simple-keyboard/build/css/index.css";
import { toast } from "sonner";

export function TakeExam() {
  const { examData, dispatch } = useExamData();

  const [isLoading, setIsLoading] = React.useState(true);

  const activeSubject = examData.studentExamState.activeSubject ?? -1;
  const activeQuestion =
    activeSubject >= 0 ? examData.studentExamState.activeQuestion ?? -1 : -1;

  const setActiveSubject = (index: number) => {
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index: 0,
        subjectIndex: index,
      },
    });
  };
  const setActiveQuestion = (index: number) => {
    console.log("setActiveQuestion", index);
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index,
        subjectIndex: activeSubject,
      },
    });
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isLoaded = !examData.test_name || examData.test_name == "";

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
    if (isLoaded) {
      navigate({
        pathname: "/start",
        search: searchParams.toString(),
      });
    } else {
      setActiveQuestion(activeQuestion);
      if (examData.remaining_time && examData.remaining_time <= 0) {
        onTestTimerExpires();
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const onTestTimerExpires = () => {
    setIsLoading(true);
    toast.dismiss();
    toast.error("Timer Expired", { position: "top-center" });
    saveTest(examData, "Yes").then(() => {
      setTimeout(() => {
        window.close();
      }, 1000);
    });
  };

  return (
    <>
      {examData.subjects.length > 0 && !isLoading ? (
        <div className="flex flex-row">
          <div className="flex min-h-screen w-full flex-col md:w-3/4 relative">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-0 bg-muted md:gap-4 md:p-10">
              <div className="flex justify-between items-center p-2 md:p-0">
                <h5 className="scroll-m-20 text-md font-medium tracking-tight">
                  {examData.test_name}
                </h5>
                <div className="flex gap-4">
                  {parseInt(examData.test_time_limit) > 0 &&
                    examData.studentExamState.start_date > 0 && (
                      <CountdownTimer
                        startTime={examData.studentExamState.start_date}
                        onExpire={onTestTimerExpires}
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

              {examData.subjects.length > 0 ? (
                <>
                  <div className="p-2 mb-[100px]">
                    {examData.subjects.map((subject, subjectIndex) => (
                      <div
                        className={cn({
                          hidden: activeSubject != subjectIndex,
                          block: activeSubject == subjectIndex,
                        })}
                      >
                        {subject.questions?.map((v, i) => {
                          return (
                            <RenderQuestion
                              index={i}
                              subjectIndex={subjectIndex}
                              isActive={activeQuestion == i}
                              setActive={setActiveQuestion}
                              key={v._id.$oid}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                ""
              )}
            </main>
            <div className="flex justify-between items-center fixed bg-gray-100 bottom-0 w-full md:w-3/4 p-2">
              <div className="flex justify-start gap-2">
                <Button
                  size={"icon"}
                  variant="outline"
                  onClick={handlePreviousQuestion}
                >
                  <ArrowLeft size={18} />
                </Button>
                {examData.studentExamState.student_answers[
                  examData.subjects[activeSubject].questions[activeQuestion]._id
                    .$oid
                ]?.review ? (
                  <Button
                    size={"default"}
                    variant="default"
                    className="bg-yellow-400 text-dark p-2"
                    onClick={() => {
                      dispatch({
                        type: "removeMarkForReview",
                        payload: {
                          index: activeQuestion,
                          subjectIndex: activeSubject,
                        },
                      });
                      handleNextQuestion();
                    }}
                  >
                    <FlagOff size={18} /> Mark & Review
                  </Button>
                ) : (
                  <Button
                    size={"default"}
                    variant="default"
                    className="bg-yellow-400 text-dark p-2"
                    onClick={() => {
                      dispatch({
                        type: "markForReview",
                        payload: {
                          index: activeQuestion,
                          subjectIndex: activeSubject,
                        },
                      });
                      handleNextQuestion();
                    }}
                  >
                    <Flag size={18} className="me-2" /> Mark & Review
                  </Button>
                )}

                {examData.studentExamState.student_answers[
                  examData.subjects[activeSubject].questions[activeQuestion]._id
                    .$oid
                ] && (
                  <Button
                    size={"icon"}
                    variant="default"
                    className="bg-gray-300 text-red-500"
                    onClick={() => {
                      dispatch({
                        type: "deleteAnswer",
                        payload:
                          examData.subjects[activeSubject].questions[
                            activeQuestion
                          ]._id.$oid,
                      });
                      handleNextQuestion();
                    }}
                  >
                    <Trash size={18} />
                  </Button>
                )}
              </div>
              <div className="flex justify-between">
                {examData.subjects.length >= 0 && (
                  <>
                    {activeSubject == examData.subjects.length - 1 &&
                    examData.studentExamState.activeSubject >= 0 &&
                    activeQuestion ==
                      examData.subjects[examData.studentExamState.activeSubject]
                        .questions.length -
                        1 ? (
                      <Button
                        onClick={() => {
                          saveTest(examData).then(() => {
                            navigate({
                              pathname: "/submit",
                              search: searchParams.toString(),
                            });
                          });
                        }}
                        className="bg-green-600 hover:bg-green-800"
                        size={"lg"}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        size={"default"}
                        className="px-3"
                      >
                        Next <ArrowRight size={18} className="ms-1" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block pt-5 bg-white w-1/4 relative border-l-2">
            <ExamDrawerContent />
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Button className="bg-green-600" asChild>
                <Link
                  to={{ pathname: "/submit", search: searchParams.toString() }}
                >
                  Submit Exam
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Loader visible={true} />
      )}
    </>
  );
}
