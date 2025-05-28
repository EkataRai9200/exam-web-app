import { Answer } from "@/context/ExamContext";

export const isAnswered = (a: Answer | undefined) => {
  return a && a.ans && a.ans.length > 0;
};
export const isMarkedReview = (a: Answer | undefined) => {
  return a && a.review;
};
export const isMarkedAndAnswered = (a: Answer | undefined) => {
  return a && isMarkedReview(a) && isAnswered(a);
};
export const isNotAnswered = (a: Answer | undefined) => {
  if (!a) return false;
  return !isAnswered(a) && !isMarkedReview(a) ? true : false;
};
