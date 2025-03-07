import { Button } from "@/components/ui/button";

import * as React from "react";

import { ArrowRight, Calculator, Info, Keyboard, List } from "lucide-react";

import CountdownTimer from "@/components/exams/timer/countDownTimer";

import Loader from "@/components/blocks/Loader";
import { ExamDrawer } from "@/components/exams/drawer/drawer";
import { useExamData, useExamWindowSwitch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

// modules css
import CalculatorBlock from "@/components/exams/calculator/CalculatorBlock";
import CATSidebar from "@/components/exams/drawer/CATSidebar";
import CATInstructionsContent from "@/components/exams/instructions/content/CATInstructionsContent";
import KeyboardBlock from "@/components/exams/keyboard/KeyboardBlock";
import { CATLanguageDropdown } from "@/components/exams/language/CATLanguageDropdown";
import WebcamComponent from "@/components/exams/proctor/WebcamComponent";
import CATQuestionPaperContent from "@/components/exams/questions/CATQuestionPaperContent";
import { CATRenderQuestion } from "@/components/exams/questions/CATRender";
import CATCountdownTimer from "@/components/exams/timer/CATCountdownTimer";
import { SubjectOverviewBlock } from "@/pages/submit/SubmitExam";
import "react-simple-keyboard/build/css/index.css";
import { toast } from "sonner";

export function TakeExam() {
  const {
    examData,
    dispatch,
    setActiveQuestion,
    setActiveSubject,
    isLoaded,
    onTimerExpires,
    saveAndNextQuestion,
    saveAnswer,
    markForReview,
    canSaveAnswer,
    submitExam,
  } = useExamData();
  const [isLoading, setIsLoading] = React.useState(true);

  const examWindow = useExamWindowSwitch();
  React.useEffect(() => {}, [examWindow.isVisible]);

  const activeSubject = examData.studentExamState.activeSubject;
  const activeQuestion = examData.studentExamState.activeQuestion;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleNextQuestion = () => {
    if (
      examData.subject_time == "yes" &&
      activeQuestion >=
        examData.subjects[examData.studentExamState.activeSubject].questions
          .length -
          1
    ) {
      toast.dismiss();
      toast.info(
        examData.submit_section_button == "yes"
          ? "Submit this section before moving to the next section"
          : "Please wait for the section to end before moving to the next section"
      );
      return false;
    }

    if (
      activeQuestion <
      examData.subjects[activeSubject].questions.length - 1
    ) {
      setActiveQuestion(activeQuestion + 1);
    } else if (activeSubject + 1 <= examData.subjects.length - 1) {
      setActiveSubject(activeSubject + 1);
    }
  };

  // const handlePreviousQuestion = () => {
  //   if (examData.subject_time == "yes" && activeQuestion <= 0) {
  //     toast.dismiss();
  //     toast.info("You cannot go back to previous question");
  //     return false;
  //   }

  //   if (activeQuestion > 0) {
  //     setActiveQuestion(activeQuestion - 1);
  //   } else if (activeSubject > 0) {
  //     setActiveQuestion(
  //       examData.subjects[activeSubject - 1].questions.length - 1,
  //       activeSubject - 1
  //     );
  //   }
  // };

  const disableCopyPaste = (e: any) => {
    if (!examData.is_keyboard_allow) {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    if (!isLoaded) {
      navigate({
        pathname: "/cat-exam/start",
        search: searchParams.toString(),
      });
    } else {
      if (examData.is_proctoring_allow) {
        examWindow.activate();
      }

      if (examData.is_keyboard_allow) {
        document.removeEventListener("copy", disableCopyPaste);
        document.removeEventListener("cut", disableCopyPaste);
        document.removeEventListener("paste", disableCopyPaste);
      }

      if (examData.subject_time == "yes") {
        if (
          examData.studentExamState.subject_times &&
          Object.values(examData.studentExamState.subject_times).every(
            (s) => s.submitted
          )
        ) {
          // test already submitted message !
          // onTimerExpires();
        } else {
        }
        setIsLoading(false);
      } else {
        // if (examData.remaining_time && examData.remaining_time <= 0) {
        //   // onTimerExpires();
        // }
        setIsLoading(false);
      }

      setActiveQuestion(activeQuestion, activeSubject);
    }
  }, []);

  React.useEffect(() => {
    document.title = `${examData.test_name}`;
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  const handleBeforeUnload = (event: any) => {
    dispatch({ type: "saveLatestState", payload: "" });

    // Show confirmation message
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave?";
  };

  React.useEffect(() => {
    const handleKeydown = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        alert("Printing is disabled on this page.");
      }
      if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshot capture is disabled.");
      }
    };

    window.addEventListener("keydown", handleKeydown);

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [showSidebar, setShowSidebar] = React.useState(true);

  const [showQuestionPaper, setShowQuestionPaper] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <>
      {examData.subjects.length > 0 && !isLoading ? (
        <>
          <div
            className="flex flex-col md:h-screen"
            onCopy={disableCopyPaste}
            onCut={disableCopyPaste}
            onPaste={disableCopyPaste}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="flex w-full justify-between items-center px-2 md:px-5 py-1 shadow z-10 bg-[#363636] text-white">
              <div className="flex flex-wrap justify-start items-center w-full md:w-full">
                <h5 className="scroll-m-20 text-sm font-medium text-muted-foreground tracking-normal text-[#f7f64e] text-start">
                  {examData.test_name}
                </h5>
                <ExamDrawer
                  key={2}
                  setShowQuestionPaper={setShowQuestionPaper}
                  setShowInstructions={setShowInstructions}
                />

                <div className="-flex w-full md:w-auto items-end justify-end mt-2 md:mt-0 md:gap-4 hidden">
                  {examData.subjects.length > 0 &&
                  examData.subject_time == "yes" &&
                  examData.studentExamState.subject_times ? (
                    <>
                      <div
                        className={cn(
                          "flex bg-gray-100 items-center justify-start gap-2"
                        )}
                      >
                        <CountdownTimer
                          beforeText="Time Left For Section :"
                          onExpire={() => {
                            dispatch({
                              type: "submit_section",
                              payload: {},
                            });
                            if (
                              !examData.studentExamState.submitted &&
                              examData.studentExamState.activeSubject >=
                                examData.subjects.length - 1
                            ) {
                              submitExam({
                                submission_source: "timer",
                              });
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {parseInt(examData.test_time_limit) > 0 &&
                        examData.studentExamState.start_date > 0 && (
                          <CountdownTimer
                            // startTime={examData.studentExamState.start_date}
                            onExpire={onTimerExpires}
                            // initialSeconds={
                            //   parseInt(examData.test_time_limit) * 60
                            // }
                            beforeText="Time left :"
                          />
                        )}
                    </>
                  )}
                </div>
              </div>
              <div className="md:w-2/6">
                <div className="flex justify-end gap-6">
                  <button
                    type="button"
                    className="text-xs flex items-center"
                    onClick={() => {
                      setShowInstructions(true);
                      setShowQuestionPaper(false);
                    }}
                  >
                    <Info className="w-5 mr-2 text-blue-600" />
                    Instructions
                  </button>
                  <button
                    type="button"
                    className="text-xs flex items-center"
                    onClick={() => {
                      setShowInstructions(false);
                      setShowQuestionPaper(true);
                    }}
                  >
                    <List className="w-5 mr-2 text-blue-600" />
                    Question Paper
                  </button>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row max-h-full md:overflow-y-hidden">
              <main
                className={cn(
                  "flex flex-col w-full h-full md:gap-0 relative items-stretch bg-white",
                  showSidebar ? "md:w-full" : ""
                )}
              >
                <div className="flex items-center justify-between w-full overflow-y-hidden overflow-x-auto md:overflow-visible gap-2 px-3 pt-2 pb-2 bg-gray-100 border-b-2">
                  <p className="text-sm">Sections</p>
                  <div className="flex justify-end items-center">
                    <CATCountdownTimer beforeText="Time Left :" />
                    <CATLanguageDropdown className="h-5" />
                    {examData.is_keyboard_allow ? (
                      <Button
                        onClick={() => {
                          dispatch({
                            type: "showHideKeyboard",
                            payload: !examData.studentExamState.showKeyboard,
                          });
                        }}
                        variant={"ghost"}
                      >
                        <Keyboard size={20} />
                      </Button>
                    ) : (
                      ""
                    )}
                    {parseInt(examData.is_calc_allow) ? (
                      <Button
                        onClick={() => {
                          dispatch({
                            type: "showHideCalculator",
                            payload: !examData.studentExamState.showCalculator,
                          });
                        }}
                        variant={"ghost"}
                        className="h-5 w-5 p-0 ms-2"
                      >
                        <Calculator size={20} />
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex items-center w-full overflow-y-hidden overflow-x-auto md:overflow-visible gap-2 px-3 pt-2 pb-2 bg-gray-100 border-b-2">
                  {examData.subjects.map((v, i) => {
                    return (
                      <div className="relative group overflow-visible">
                        <Button
                          key={v.sub_id}
                          size={"sm"}
                          disabled={
                            examData.subject_time == "yes" && i != activeSubject
                          }
                          variant={activeSubject == i ? "default" : "outline"}
                          onClick={() => setActiveSubject(i)}
                          className="h-8 font-normal text-xs uppercase"
                        >
                          {v.name}
                        </Button>
                        <div className="hidden absolute w-[300px] top-[50px] h-[200px] z-50 left-0 md:group-hover:block">
                          <SubjectOverviewBlock hideTitle subject={v} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {examData.subjects.length > 0 ? (
                  <>
                    {/* <ScrollArea
                      className={`md:my-0 h-full pt-0 ${
                        examData.studentExamState.showCalculator
                          ? "pb-[500px]"
                          : "pb-[100px]"
                      } md:pb-[70px]`}
                    > */}
                    <div className="flex flex-col flex-1 overflow-auto">
                      <CATRenderQuestion
                        index={activeQuestion}
                        subjectIndex={activeSubject}
                        isActive={true}
                        setActive={setActiveQuestion}
                        key={
                          examData.subjects[activeSubject].questions[
                            activeQuestion
                          ]._id.$oid
                        }
                      />
                    </div>
                    {/* </ScrollArea> */}
                  </>
                ) : (
                  ""
                )}

                <div
                  className={cn(
                    "flex justify-between items-center fixed bg-white bottom-0 w-full md:mt-5 border-t-2",
                    showSidebar ? "md:w-[calc(100%-300px)] left-0 p-2" : ""
                  )}
                >
                  <div className="flex justify-start gap-2">
                    <Button
                      size={"lg"}
                      variant="default"
                      className="bg-white border border-gray-200 text-dark font-normal hover:bg-blue-500 hover:text-white hover:border-blue-500 px-5"
                      onClick={async () => {
                        await markForReview({
                          subjectIndex: examData.studentExamState.activeSubject,
                          index: examData.studentExamState.activeQuestion,
                          ans: examData.studentExamState.activeAnswer,
                        });
                        handleNextQuestion();
                      }}
                    >
                      {/* <Flag size={18} className="me-2" /> */}
                      Mark for Review & Next
                    </Button>

                    {examData.subjects.length > 0 && activeSubject >= 0 && (
                      <Button
                        size={"lg"}
                        variant="default"
                        className="bg-white border border-gray-200 text-dark font-normal hover:bg-blue-500 hover:text-white hover:border-blue-500 px-5"
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
                        Clear Response
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between gap-2">
                    {/* <Button variant="outline" onClick={handlePreviousQuestion}>
                      <ArrowLeft size={15} />{" "}
                      <span className="hidden md:ps-1 md:block">Previous</span>
                    </Button> */}
                    {examData.subjects.length >= 0 && (
                      <>
                        {examData.subject_time == "yes" &&
                        activeQuestion ==
                          examData.subjects[
                            examData.studentExamState.activeSubject
                          ].questions.length -
                            1 ? (
                          <Button
                            size={"default"}
                            onClick={async () => {
                              if (
                                !canSaveAnswer({
                                  subjectIndex:
                                    examData.studentExamState.activeSubject,
                                  index:
                                    examData.studentExamState.activeQuestion,
                                })
                              )
                                return;
                              await saveAnswer({
                                subjectIndex:
                                  examData.studentExamState.activeSubject,
                                index: examData.studentExamState.activeQuestion,
                                ans: examData.studentExamState.activeAnswer,
                              });
                              dispatch({
                                type: "removeMarkForReview",
                                payload: {
                                  index: activeQuestion,
                                  subjectIndex: activeSubject,
                                },
                              });
                            }}
                            className="px-3"
                          >
                            <span className="hidden md:ps-1 md:block">
                              Save
                            </span>{" "}
                            <ArrowRight size={15} className="ms-1 md:hidden" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              saveAndNextQuestion();
                            }}
                            size={"lg"}
                            className="bg-[#0c7cd5] border border-gray-200 text-white font-normal hover:bg-blue-500 hover:text-white hover:border-blue-500 px-5"
                          >
                            Save & Next
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {examData.subjects.length > 0 &&
                  examData.studentExamState.activeSubject >= 0 && (
                    <CATQuestionPaperContent
                      open={showQuestionPaper}
                      setOpen={setShowQuestionPaper}
                    />
                  )}
                {examData.subjects.length > 0 &&
                  examData.studentExamState.activeSubject >= 0 && (
                    <CATInstructionsContent
                      open={showInstructions}
                      setOpen={setShowInstructions}
                    />
                  )}
              </main>
              <CATSidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                setShowQuestionPaper={setShowQuestionPaper}
                setShowInstructions={setShowInstructions}
              />
            </div>
          </div>
          {examData.is_keyboard_allow ? <KeyboardBlock /> : ""}
          {parseInt(examData.is_calc_allow) ? <CalculatorBlock /> : ""}
        </>
      ) : (
        <Loader visible={true} />
      )}
      {examData.is_proctoring_allow ? <WebcamComponent /> : ""}
    </>
  );
}
