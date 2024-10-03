import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Answer, ExamContext, Question } from "@/context/ExamContext";
import { authenticateToken, getTestDetails } from "@/pages/start/StartPage";
import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { saveTest } from "./utils";
import { isAnswered } from "@/components/exams/drawer/examDrawerContent";

export function useExamData() {
  const { state, dispatch } = useContext(ExamContext);
  const [isLoaded, setIsLoaded] = React.useState(
    state._id && state.subjects.length > 0
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const fetchExamData = async () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    const authUser = await authenticateToken(token);

    const examData = await getTestDetails(token, authUser.webtesttoken);

    return { ...examData, authUser };
  };

  const saveBrowserActivity = async (windowSwitch: number) => {
    console.log("state", state);
    if (!state.authUser) return;

    const url =
      state?.authUser?.api_url + "/save-browser-activity/" + state._id.$oid;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_id: state._id.$oid,
        webtesttoken: state.authUser?.webtesttoken,
      }),
    }).catch(() => {
      setTimeout(() => {
        saveBrowserActivity(windowSwitch);
      }, 2000);
    });

    return res;
  };

  const qTimeTakenRef = React.useRef<number>(0);
  const qTimerRef = React.useRef<any>();
  const recordQuestionTime = () => {
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    qTimeTakenRef.current = 0;
    qTimerRef.current = setInterval(() => {
      qTimeTakenRef.current++;
    }, 1000);
  };

  const setActiveQuestion = (index: number, subjectIndex?: number) => {
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index,
        subjectIndex: subjectIndex ?? state.studentExamState.activeSubject,
        tt: qTimeTakenRef.current,
      },
    });
    recordQuestionTime();
  };

  const setActiveSubject = (subjectIndex: number) => {
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index: 0,
        subjectIndex: subjectIndex,
      },
    });

    recordQuestionTime();
  };

  const getRemainingTime = () => {
    let timeSpent = 0;

    const endTimeLeft = state.test_end_date
      ? Math.round((state.test_end_date - Date.now()) / 1000)
      : 0;

    if (state.test_end_date && state.test_end_date < Date.now()) {
      return 0;
    }
    if (state.subject_time == "yes" && state.studentExamState.subject_times) {
      const activeSubData =
        state.subjects[state.studentExamState.activeSubject] ?? {};
      const activeSubTime =
        state.studentExamState.subject_times[activeSubData.sub_id] ?? {};
      if (!activeSubTime.start_time) {
        return parseInt(activeSubData.subject_time) * 60;
      }
      const endTime =
        activeSubTime.start_time +
        parseInt(activeSubData.subject_time) * 60 * 1000;
      if (activeSubTime.submitted) return 0;
      return Math.round((endTime - Date.now()) / 1000);
    } else {
      timeSpent = Math.round(
        (Date.now() - state.studentExamState.startTimeLocal) / 1000
      );
      const timeLeft =
        parseInt(state.test_time_limit) * 60 -
        timeSpent -
        (state.elapsed_time ?? 0);
      return state.test_end_date
        ? Math.min(timeLeft, endTimeLeft ?? 0)
        : timeLeft;
    }
  };

  const submitExam = async ({ message }: { message?: string } = {}) => {
    saveTest(state, "Yes").then((res) => {
      if (res.status) {
        MySwal.fire({
          title: message ?? "Your exam has been submitted.",
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          backdrop: "rgba(0, 0, 0, 0.5)",
          confirmButtonText: "Close Window",
        }).then((_result) => {
          navigate({
            pathname: "/feedback",
            search: searchParams.toString(),
          });
        });
      } else {
        alert("We were unable to submit your exam. Try Again !");
      }
    });
    return;
  };

  const onTimerExpires = () => {
    submitExam({
      message: "Time is up. Your exam has been automatically submitted. ",
    });
  };

  const saveAnswer = async ({
    subjectIndex,
    index,
    ans,
  }: {
    subjectIndex: number;
    index: number;
    ans: Answer["ans"];
  }) => {
    const question: Question = state.subjects[subjectIndex].questions[index];
    const studentResponse =
      state.studentExamState.student_answers[question._id.$oid] ?? {};
    const payload = {
      ...studentResponse,
      ans: ans,
      sub_id: state.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };

    if (question.question_type == "SUBJECTIVE") {
      payload.ans = ans.content;
      payload.image = ans.subjectiveimages;
    }

    console.log("saving...", payload);

    dispatch({
      type: "markAnswer",
      payload,
    });
  };

  const canSaveAnswer = ({
    subjectIndex,
    index,
  }: {
    subjectIndex: number;
    index: number;
  }) => {
    const activeSubData = state.subjects[state.studentExamState.activeSubject];

    if (activeSubData.qlimit && parseInt(activeSubData.qlimit) > 0) {
      const question: Question = state.subjects[subjectIndex].questions[index];
      const attemptedNoOfQs = Object.values(
        state.studentExamState.student_answers
      ).filter(
        (v) =>
          v.sub_id == activeSubData.sub_id &&
          v.qid != question._id.$oid &&
          isAnswered(v)
      ).length;

      if (attemptedNoOfQs >= parseInt(activeSubData.qlimit)) {
        MySwal.fire(
          `You can attempt a maximum of ${activeSubData.qlimit} questions on this subject`,
          "",
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const saveAndNextQuestion = async () => {
    const subjectIndex = state.studentExamState.activeSubject;
    const index = state.studentExamState.activeQuestion;
    if (
      !canSaveAnswer({
        subjectIndex,
        index,
      })
    )
      return;
    await saveAnswer({
      subjectIndex,
      index,
      ans: state.studentExamState.activeAnswer,
    });

    if (
      state.studentExamState.activeQuestion <
      state.subjects[state.studentExamState.activeSubject].questions.length - 1
    ) {
      setActiveQuestion(state.studentExamState.activeQuestion + 1);
    } else if (
      state.studentExamState.activeSubject + 1 <=
      state.subjects.length - 1
    ) {
      setActiveSubject(state.studentExamState.activeSubject + 1);
    } else {
      navigate({
        pathname: "/submit",
        search: searchParams.toString(),
      });
    }

    dispatch({
      type: "removeMarkForReview",
      payload: {
        index: state.studentExamState.activeQuestion,
        subjectIndex: state.studentExamState.activeSubject,
      },
    });
  };

  useEffect(() => {
    setIsLoaded(state._id && state.subjects.length > 0);
  }, [state]);

  return {
    examData: state,
    dispatch,
    fetchExamData,
    saveBrowserActivity,
    setActiveQuestion,
    setActiveSubject,
    isLoaded,
    questionTimeTaken: qTimeTakenRef,
    submitExam,
    onTimerExpires,
    getRemainingTime,
    saveAndNextQuestion,
  };
}

export function useSaveExam() {
  const { examData } = useExamData();

  const save = (payload?: Answer) => {
    const d = { ...examData };
    if (payload) d.studentExamState.student_answers[payload.qid] = payload;
    saveTest(d).catch(() => {
      toast({
        variant: "destructive",
        title: "We were unable to save answers",
        action: (
          <ToastAction altText="Try again" onClick={() => save(payload)}>
            Try again
          </ToastAction>
        ),
      });
    });
  };

  return { save };
}

const usePageVisibility = () => {
  const [times, setTimes] = React.useState(0);

  const [isVisible, setIsVisible] = React.useState(
    document.visibilityState === "visible"
  );

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
      if (document.visibilityState === "visible") setTimes((t) => t + 1);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { isVisible, times };
};

const useExamWindowSwitch = () => {
  const { isVisible, times: windowSwitch } = usePageVisibility();
  const { saveBrowserActivity, examData, submitExam } =
    useExamData();
  const [active, setActive] = React.useState(false);

  const activate = () => {
    setActive(true);
    const initbrowserActivity = async function () {};
    initbrowserActivity();
  };
  const MySwal = withReactContent(Swal);

  const onWindowChange = () => {
    if (!active) return false;

    if (isVisible && windowSwitch > 0) {
      saveBrowserActivity(windowSwitch);
      if (
        windowSwitch > (examData.proctoring_allowed_browser_switches ?? 3) &&
        examData.browserswitchsubmittest == "yes"
      ) {
        submitExam({
          message:
            "You have reached the maximum number of browser switches. Your exam has been automatically submitted. ",
        });
        return;
      } else {
        MySwal.fire({
          title: <span className="text-md">Navigated Away</span>,
          html: (
            <>
              <div className="text-start">
                <p className="text-sm">
                  You had navigated away from the test window. This will be
                  reported to Moderator
                </p>
                <p className="text-sm">
                  <span className="text-red-500">
                    Do Not repeat this behaviour
                  </span>{" "}
                  Otherwise you may get disqualified
                </p>
                <p className="text-sm">Browser Switch : {windowSwitch}</p>
              </div>
            </>
          ),
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          backdrop: "rgba(0, 0, 0, 0.5)",
          confirmButtonText: "Continue",
        });
      }
    }
  };

  React.useEffect(() => {
    if (active) onWindowChange();
  }, [isVisible, windowSwitch]);

  return { isVisible, windowSwitch, activate };
};

export { useExamWindowSwitch, usePageVisibility };
