import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import {
  Answer,
  ExamContext,
  Question,
  saveLatestTimeAndState,
  SubmissionSource,
} from "@/context/ExamContext";
import { generateWebTestToken } from "@/services/authService";
import { fetchTestDetails } from "@/services/examService";
import { saveTest } from "@/utils/common";
import { isAnswered } from "@/utils/questionUtils";
import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

    const authUser = await generateWebTestToken(token);

    const examData = await fetchTestDetails(token, authUser.webtesttoken);

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

  const reportStudentWebCam = async (image: any) => {
    // console.log("state", state);
    if (!state.authUser) return;
    // return;

    const url =
      state?.authUser?.api_url + "/save-test-image-proctor/" + state._id.$oid;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_id: state._id.$oid,
        webtesttoken: state.authUser?.webtesttoken,
        image,
      }),
    }).catch(() => {
      setTimeout(() => {
        reportStudentWebCam(reportStudentWebCam);
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
      // console.log("started recording time...", qTimeTakenRef);
    }, 1000);
  };

  const setActiveQuestion = (index: number, subjectIndex?: number) => {
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index,
        subjectIndex: subjectIndex ?? state.studentExamState.activeSubject,
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

  const submitExam = async ({
    message,
    submission_source,
  }: { message?: string; submission_source?: SubmissionSource } = {}) => {
    if (submission_source)
      state.studentExamState.submission_source = submission_source;

    const afterSubmit = () => {
      dispatch({
        type: "notifySubmitted",
        payload: "",
      });
      navigate({
        pathname: "/feedback",
        search: searchParams.toString(),
      });
      MySwal.fire({
        title: message ?? "Your exam has been submitted.",
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        backdrop: "rgba(0, 0, 0, 0.5)",
        confirmButtonText: "Close",
      });
    };

    if (state.studentExamState.submitted) {
      afterSubmit();
      return;
    }

    await saveLatestTimeAndState(state, true).then((res) => {
      if (res && res?.status) {
        afterSubmit();
      }
    });
    return;
  };

  const onTimerExpires = () => {
    if (state.subject_time == "yes") {
      dispatch({
        type: "submit_section",
        payload: {},
      });
    } else {
      submitExam({
        message: "Time is up. Your exam has been automatically submitted. ",
        submission_source: "timer",
      });
    }
  };

  const createPayloadForAnswer = async ({
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
      tt: (studentResponse.tt ?? 0) + qTimeTakenRef.current,
    };
    if (question.question_type == "SUBJECTIVE") {
      payload.ans = ans.content;
      payload.image = ans.subjectiveimages;
    }
    return payload;
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
    const payload = await createPayloadForAnswer({
      subjectIndex,
      index,
      ans,
    });

    dispatch({
      type: "markAnswer",
      payload,
    });
  };

  const markForReview = async ({
    subjectIndex,
    index,
    ans,
  }: {
    subjectIndex: number;
    index: number;
    ans: Answer["ans"];
  }) => {
    const payload = await createPayloadForAnswer({
      subjectIndex,
      index,
      ans,
    });
    dispatch({
      type: "markForReview",
      payload: {
        index: index,
        subjectIndex: subjectIndex,
        answer: payload,
      },
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

      if (attemptedNoOfQs > parseInt(activeSubData.qlimit)) {
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
      dispatch({
        type: "setShowSubmitModal",
        payload: true,
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
    saveAndNextQuestion,
    canSaveAnswer,
    saveAnswer,
    markForReview,
    reportStudentWebCam,
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
      console.log("document.hidden", document.hidden);
      setIsVisible(document.visibilityState === "visible");
      if (document.visibilityState === "visible") setTimes((t) => t + 1);
    };

    const handleFocusChange = () => {
      // console.log("window.isFocused", document.hasFocus());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.onfocus = handleFocusChange;
    window.onblur = handleFocusChange;

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { isVisible, times };
};

const useExamWindowSwitch = () => {
  const { isVisible, times: windowSwitch } = usePageVisibility();
  const { saveBrowserActivity, examData, submitExam } = useExamData();
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
          submission_source: "proctor",
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
