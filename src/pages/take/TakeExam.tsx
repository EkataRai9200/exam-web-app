import { Button } from "@/components/ui/button";

import * as React from "react";

import { ArrowLeft, ArrowRight, Trash } from "lucide-react";

import { RenderQuestion } from "@/components/exams/questions/render";
import CountdownTimer from "@/components/exams/timer/countDownTimer";

import Loader from "@/components/blocks/Loader";
import { ExamDrawer } from "@/components/exams/drawer/drawer";
import { useExamData } from "@/lib/hooks";
import { cn, saveTest } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// modules css
import Sidebar from "@/components/exams/drawer/Sidebar";
import { isAnswered } from "@/components/exams/drawer/examDrawerContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Subject } from "@/context/ExamContext";
import "react-simple-keyboard/build/css/index.css";
import QuestionPaperContent from "@/components/exams/questions/QuestionPaperContent";
import InstructionsContent from "@/components/exams/instructions/content/InstructionsContent";

export function TakeExam() {
  const { examData, dispatch } = useExamData();

  const [isLoading, setIsLoading] = React.useState(true);

  const activeSubject = examData.studentExamState.activeSubject;
  const activeQuestion = examData.studentExamState.activeQuestion;
  const MySwal = withReactContent(Swal);

  const isAllowChangeSubject = (index: number) => {
    const activeSubData = examData.subjects[index];
    if (
      examData.subject_time == "yes" &&
      examData.studentExamState.subject_times
    ) {
      return false;
    }

    // add subject question attempt limit
    if (activeSubData.qlimit && parseInt(activeSubData.qlimit) > 0) {
      const attemptedNoOfQs = Object.values(
        examData.studentExamState.student_answers
      ).filter((v) => v.sub_id == activeSubData.sub_id && isAnswered(v)).length;

      if (attemptedNoOfQs > parseInt(activeSubData.qlimit)) {
        MySwal.fire(
          `You can attempt a maximum of ${activeSubData.qlimit} questions on this subject`,
          "",
          "error"
        );
      }
      return attemptedNoOfQs <= parseInt(activeSubData.qlimit);
    }

    return true;
  };

  const setActiveSubject = (index: number, check = true) => {
    // TODO: if subject lock & timer is enabled, do not change
    if (check && !isAllowChangeSubject(examData.studentExamState.activeSubject))
      return false;
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index: 0,
        subjectIndex: index,
      },
    });
  };

  const setActiveQuestion = (index: number) => {
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
      if (examData.remaining_time && examData.remaining_time <= 0) {
        onTestTimerExpires();
      } else {
        // check if subject timer is enabled & all subjects are submitted
        if (
          examData.subject_time == "yes" &&
          examData.studentExamState.subject_times &&
          Object.values(examData.studentExamState.subject_times).every(
            (s) => s.submitted
          )
        ) {
          onTestTimerExpires();
        }

        setIsLoading(false);
      }
    }
  }, []);

  const onTestTimerExpires = () => {
    setIsLoading(true);
    dispatch({ type: "submit_exam", payload: examData });
    MySwal.fire({
      title: "Time is up. Your exam has been automatically submitted. ",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "Close Window",
    }).then((_result) => {
      setTimeout(() => {
        if (typeof (window as any).Android != "undefined") {
          (window as any).Android.testCompletedCallback();
        } else {
          window.close();
        }
      }, 1500);
    });
  };

  const disableCopyPaste = (e: any) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    return () => {
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  const [showSidebar, setShowSidebar] = React.useState(true);

  const [showQuestionPaper, setShowQuestionPaper] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <>
      {examData.subjects.length > 0 && !isLoading ? (
        <div className="flex flex-col md:h-screen">
          <div className="flex w-full justify-between items-center px-2 md:px-5 py-1 shadow z-10 bg-white">
            <div className="flex flex-wrap justify-between items-center w-full md:w-3/4">
              <h5 className="scroll-m-20 text-sm font-medium text-muted-foreground tracking-normal">
                {examData.test_name}
              </h5>
              <ExamDrawer
                key={2}
                setShowQuestionPaper={setShowQuestionPaper}
                setShowInstructions={setShowInstructions}
              />

              <div className="flex w-full md:w-auto items-end justify-end mt-2 md:mt-0 md:gap-4">
                {examData.subjects.length > 0 &&
                examData.subject_time == "yes" ? (
                  <>
                    {examData.studentExamState.subject_times &&
                      Object.values(
                        examData.studentExamState.subject_times
                      ).map((timer) => {
                        const subData: Subject =
                          examData.subjects.filter(
                            (s) => s.sub_id == timer._id
                          )[0] ?? {};
                        const activeSubData: Subject =
                          examData.subjects[
                            examData.studentExamState.activeSubject
                          ] ?? {};
                        const subDataIndex =
                          examData.subjects.findIndex(
                            (s) => s.sub_id == timer._id
                          ) ?? {};
                        return (
                          <>
                            {!timer.submitted && (
                              <div
                                className={cn(
                                  "flex bg-gray-100 items-center justify-start gap-2",
                                  subData.sub_id == activeSubData.sub_id &&
                                    !timer.submitted
                                    ? "flex"
                                    : "hidden"
                                )}
                              >
                                <CountdownTimer
                                  startTime={timer.start_time}
                                  initialSeconds={
                                    parseInt(subData.subject_time) * 60
                                  }
                                  beforeText="Time Left For Section :"
                                  onExpire={() => {
                                    if (
                                      subDataIndex + 1 <=
                                      examData.subjects.length - 1
                                    ) {
                                      if (
                                        examData.subject_times &&
                                        !timer.submitted
                                      ) {
                                        dispatch({
                                          type: "submit_section",
                                          payload: {},
                                        });
                                      }
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </>
                        );
                      })}
                  </>
                ) : (
                  <>
                    {parseInt(examData.test_time_limit) > 0 &&
                      examData.studentExamState.start_date > 0 && (
                        <CountdownTimer
                          startTime={examData.studentExamState.start_date}
                          onExpire={onTestTimerExpires}
                          initialSeconds={
                            parseInt(examData.test_time_limit) * 60
                          }
                          beforeText="Time left :"
                        />
                      )}
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block md:w-1/4"></div>
          </div>
          <div className="flex md:flex-row max-h-full md:overflow-y-hidden">
            <main
              className={cn(
                "flex flex-col w-full h-full md:gap-0 relative items-stretch bg-white",
                showSidebar ? "md:w-3/4" : ""
              )}
              onCopy={disableCopyPaste}
              onCut={disableCopyPaste}
              onPaste={disableCopyPaste}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="flex items-center w-full overflow-x-auto md:overflow-y-hidden gap-2 px-3 pt-2 pb-2 bg-gray-100 border-b-2">
                <p className="text-sm border-r-2 pr-2">Sections</p>
                {examData.subjects.map((v, i) => {
                  return (
                    <Button
                      key={v.sub_id}
                      size={"sm"}
                      disabled={
                        examData.subject_time == "yes" && i != activeSubject
                      }
                      variant={activeSubject == i ? "default" : "outline"}
                      onClick={() => setActiveSubject(i)}
                    >
                      {v.name}
                    </Button>
                  );
                })}
              </div>

              {examData.subjects.length > 0 ? (
                <>
                  <ScrollArea className="md:my-0 px-2 h-full pt-0 pb-[100px] md:pb-[70px]">
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
                  </ScrollArea>
                </>
              ) : (
                ""
              )}

              <div
                className={cn(
                  "flex justify-between items-center fixed bg-slate-100 bottom-0 w-full md:mt-5",
                  showSidebar ? "md:w-3/4 left-0 p-2" : ""
                )}
              >
                <div className="flex justify-start gap-2">
                  <Button
                    size={"icon"}
                    // variant="outline"
                    onClick={handlePreviousQuestion}
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <Button
                    size={"default"}
                    variant="default"
                    className="bg-purple-800 px-2"
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
                    {/* <Flag size={18} className="me-2" /> */}
                    Mark for Review
                  </Button>

                  {isAnswered(
                    examData.studentExamState.student_answers[
                      examData.subjects[activeSubject].questions[activeQuestion]
                        ._id.$oid
                    ]
                  ) && (
                    <Button
                      size={"icon"}
                      variant="default"
                      className="bg-red-200 text-red-500"
                      onClick={() => {
                        dispatch({
                          type: "deleteAnswer",
                          payload:
                            examData.subjects[activeSubject].questions[
                              activeQuestion
                            ]._id.$oid,
                        });
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
                        examData.subjects[
                          examData.studentExamState.activeSubject
                        ].questions.length -
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
                          onClick={() => {
                            handleNextQuestion();
                            dispatch({
                              type: "removeMarkForReview",
                              payload: {
                                index: activeQuestion,
                                subjectIndex: activeSubject,
                              },
                            });
                          }}
                          size={"default"}
                          className="px-3"
                        >
                          Next <ArrowRight size={15} className="ms-1" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <QuestionPaperContent
                open={showQuestionPaper}
                setOpen={setShowQuestionPaper}
              />
              <InstructionsContent
                open={showInstructions}
                setOpen={setShowInstructions}
              />
            </main>
            <Sidebar
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
              setShowQuestionPaper={setShowQuestionPaper}
              setShowInstructions={setShowInstructions}
            />
          </div>
        </div>
      ) : (
        <Loader visible={true} />
      )}
    </>
  );
}
