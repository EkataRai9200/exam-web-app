import { ExamContext } from "@/context/ExamContext";
import { authenticateToken, getTestDetails } from "@/pages/start/StartPage";
import { useContext } from "react";

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

