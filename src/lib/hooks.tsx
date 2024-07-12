import { Answer, ExamContext } from "@/context/ExamContext";
import { authenticateToken, getTestDetails } from "@/pages/start/StartPage";
import { useContext } from "react";
import { saveTest } from "./utils";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function useExamData() {
  const { state, dispatch } = useContext(ExamContext);

  const fetchExamData = async () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    const authUser = await authenticateToken(token);

    const examData = await getTestDetails(token, authUser.webtesttoken);

    return { ...examData, authUser };
  };

  return { examData: state, dispatch, fetchExamData };
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
