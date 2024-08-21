import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Answer, ExamContext } from "@/context/ExamContext";
import { authenticateToken, getTestDetails } from "@/pages/start/StartPage";
import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getBrowserInfo, saveTest, showSaveTestError } from "./utils";

export function useExamData() {
  const { state, dispatch } = useContext(ExamContext);
  const [isLoaded, setIsLoaded] = React.useState(
    state._id && state.subjects.length > 0
  );

  useEffect(() => {
    setIsLoaded(state._id && state.subjects.length > 0);
  }, [state]);

  const fetchExamData = async () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    const authUser = await authenticateToken(token);

    const examData = await getTestDetails(token, authUser.webtesttoken);

    return { ...examData, authUser };
  };

  const saveBrowserActivity = async () => {
    if (!state.authUser) return;
    const url = state.authUser.api_url + "/update_activity/" + state._id.$oid;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        browser: {
          info: getBrowserInfo(),
          windowSwitch: state.studentExamState.windowSwitch,
        },
      }),
    }).catch(() => {
      showSaveTestError(() => saveTest(state), state);
    });

    return res;
  };

  const qTimeTakenRef = React.useRef<number>(0);
  const qTimerRef = React.useRef<any>();
  // const [qTimeTaken, setqTimeTaken] = React.useState(0);

  const recordQuestionTime = () => {
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    qTimeTakenRef.current = 0;
    qTimerRef.current = setInterval(() => {
      qTimeTakenRef.current++;
    }, 1000);
  };

  const setActiveQuestion = (index: number) => {
    dispatch({
      type: "setActiveQuestion",
      payload: {
        index,
        subjectIndex: state.studentExamState.activeSubject,
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const submitExam = ({ message }: { message?: string } = {}) => {
    dispatch({ type: "submit_exam", payload: {} });
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
  };

  const onTimerExpires = () => {
    submitExam({
      message: "Time is up. Your exam has been automatically submitted. ",
    });
  };

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
  const { saveBrowserActivity, examData, onTimerExpires } = useExamData();
  const [active, setActive] = React.useState(false);

  const activate = () => {
    setActive(true);
  };
  const MySwal = withReactContent(Swal);

  const onWindowChange = () => {
    if (!active) return false;

    if (isVisible && windowSwitch > 0) {
      saveBrowserActivity();
      if (windowSwitch > 3 && examData.browserswitchsubmittest == "yes") {
        onTimerExpires();
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
