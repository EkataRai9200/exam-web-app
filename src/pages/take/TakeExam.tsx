import { Button } from "@/components/ui/button";

import * as React from "react";

import { ArrowLeft, ArrowRight, Trash } from "lucide-react";

import { RenderQuestion } from "@/components/exams/questions/render";
import CountdownTimer from "@/components/exams/timer/countDownTimer";

import Loader from "@/components/blocks/Loader";
import { ExamDrawer } from "@/components/exams/drawer/drawer";
import { useExamData, useExamWindowSwitch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

// modules css
import CalculatorBlock from "@/components/exams/calculator/CalculatorBlock";
import Sidebar from "@/components/exams/drawer/Sidebar";
import InstructionsContent from "@/components/exams/instructions/content/InstructionsContent";
import KeyboardBlock from "@/components/exams/keyboard/KeyboardBlock";
import QuestionPaperContent from "@/components/exams/questions/QuestionPaperContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import "react-simple-keyboard/build/css/index.css";
import { toast } from "sonner";
import WebcamComponent from "@/components/exams/proctor/WebcamComponent";
import { SubjectOverviewBlock } from "@/pages/submit/SubmitExam";
import { requestFullScreen } from "@/lib/utils";
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
  
  // Add state to track fullscreen status
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const examWindow = useExamWindowSwitch();
  React.useEffect(() => {}, [examWindow.isVisible]);

  const activeSubject = examData.studentExamState.activeSubject;
  const activeQuestion = examData.studentExamState.activeQuestion;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Function to check fullscreen status
  const checkFullscreen = React.useCallback(() => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement;

    // macOS Green Button Fullscreen Detection
    const isMacOSChrome = /Macintosh.*Chrome/.test(navigator.userAgent);
    const visualFullscreen = isMacOSChrome
      ? window.outerWidth === screen.width && window.outerHeight === screen.height
      : false;

    // Check using matchMedia API (some browsers support this)
    const mediaQueryFullscreen = window.matchMedia("(display-mode: fullscreen)").matches;

    // Final fullscreen status
    const fullscreenStatus = !!fullscreenElement || visualFullscreen || mediaQueryFullscreen;
    
    setIsFullscreen(fullscreenStatus);
    return fullscreenStatus;
  }, []);

  // Set up fullscreen monitoring
  React.useEffect(() => {
    // Only enforce fullscreen if proctoring is enabled
    if (!examData.is_proctoring_allow) {
      return;
    }
    
    // Initial fullscreen request
    requestFullScreen();
    
    // Listen for standard fullscreen events
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("MSFullscreenChange", checkFullscreen);
    
    // Listen for resize (detects macOS green button)
    window.addEventListener("resize", checkFullscreen);
    
    // Initial check
    checkFullscreen();
    
    // Periodic check as a fallback
    const intervalId = setInterval(checkFullscreen, 1000);
    
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("MSFullscreenChange", checkFullscreen);
      window.removeEventListener("resize", checkFullscreen);
      clearInterval(intervalId);
    };
  }, [checkFullscreen, examData.is_proctoring_allow]);

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

  const handlePreviousQuestion = () => {
    if (examData.subject_time == "yes" && activeQuestion <= 0) {
      toast.dismiss();
      toast.info("You cannot go back to previous question");
      return false;
    }

    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1);
    } else if (activeSubject > 0) {
      setActiveQuestion(
        examData.subjects[activeSubject - 1].questions.length - 1,
        activeSubject - 1
      );
    }
  };

  const disableCopyPaste = (e: any) => {
    if (!examData.is_keyboard_allow) {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    if (!isLoaded) {
      navigate({
        pathname: "/start",
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

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const [showSidebar, setShowSidebar] = React.useState(true);

  const [showQuestionPaper, setShowQuestionPaper] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <>
      {examData.subjects.length > 0 && !isLoading && (examData.is_proctoring_allow ? isFullscreen : true) ? (
        <>
          <div
            className="flex flex-col md:h-screen"
            onCopy={disableCopyPaste}
            onCut={disableCopyPaste}
            onPaste={disableCopyPaste}
            onContextMenu={(e) => e.preventDefault()}
          >
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
              <div className="hidden md:block md:w-1/4"></div>
            </div>
            <div className="flex md:flex-row max-h-full md:overflow-y-hidden">
              <main
                className={cn(
                  "flex flex-col w-full h-full md:gap-0 relative items-stretch bg-white",
                  showSidebar ? "md:w-3/4" : ""
                )}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 px-3 pt-2 pb-2 border-b-2 overflow-x-auto scroll-smooth overflow-y-visible"> {/* Added overflow-y-visible */}
                    <p className="text-sm border-r-2 pr-2 whitespace-nowrap">Sections</p>
                    {examData.subjects.map((v, i) => (
                      <div key={v.sub_id} className="relative group" style={{ position: "static" }}> {/* Force root positioning */}
                        <Button
                          size="sm"
                          disabled={examData.subject_time === "yes" && i !== activeSubject}
                          variant={activeSubject === i ? "default" : "outline"}
                          onClick={() => setActiveSubject(i)}
                        >
                          {v.name}
                        </Button>
                        <div className="hidden fixed z-[9999] md:group-hover:block
                      mt-2 left-[var(--hover-left)] top-[var(--hover-top)] 
                      w-[300px] h-[50px] shadow-lg border bg-background">
                          <SubjectOverviewBlock hideTitle subject={v} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {examData.subjects.length > 0 ? (
                  <>
                    <ScrollArea
                      className={`md:my-0 px-2 h-full pt-0 ${examData.studentExamState.showCalculator
                          ? "pb-[500px]"
                          : "pb-[100px]"
                        } md:pb-[70px]`}
                    >
                      <RenderQuestion
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
                      size={"default"}
                      variant="default"
                      className="bg-white text-black border border-black hover:bg-purple-800 hover:text-white hover:border-purple-800 px-2"
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
                      Mark for Review
                    </Button>

                    {examData.subjects.length > 0 &&
                      activeSubject >= 0 &&
                      examData.studentExamState.activeAnswer != "" && (
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
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" onClick={handlePreviousQuestion}>
                      <ArrowLeft size={15} />{" "}
                      <span className="hidden md:ps-1 md:block">Previous</span>
                    </Button>
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
                            size={"default"}
                            className="px-3"
                          >
                            <span className="hidden md:ps-1 md:block">
                              Save & Next
                            </span>{" "}
                            <ArrowRight size={15} className="ms-1" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {examData.subjects.length > 0 &&
                  examData.studentExamState.activeSubject >= 0 && (
                    <QuestionPaperContent
                      open={showQuestionPaper}
                      setOpen={setShowQuestionPaper}
                    />
                  )}
                {examData.subjects.length > 0 &&
                  examData.studentExamState.activeSubject >= 0 && (
                    <InstructionsContent
                      open={showInstructions}
                      setOpen={setShowInstructions}
                    />
                  )}
              </main>
              <Sidebar
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
        <>
          {examData.is_proctoring_allow && !isFullscreen ? (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '20px'
              }}
            >
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Test Paused</h2>
          
              <button
                onClick={requestFullScreen}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0c7cd5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
            
                Start Test
              </button>
            </div>
          ) : (
            <Loader visible={true} />
          )}
        </>
      )}
      {examData.is_proctoring_allow ? <WebcamComponent /> : ""}
    </>
  );
}
