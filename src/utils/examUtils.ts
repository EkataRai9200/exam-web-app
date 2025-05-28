import { ExamDetailData } from "@/context/ExamContext";

export const calcTotalQs = (subjects: ExamDetailData["subjects"]): number => {
  return subjects.reduce((acc, v) => acc + v.questions.length, 0);
};
