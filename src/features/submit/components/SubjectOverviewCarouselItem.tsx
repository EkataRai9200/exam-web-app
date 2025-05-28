import { useExamData } from "@/lib/hooks";

import { ExamDetailData } from "@/context/ExamContext";

import Answered from "@/components/status/Answered";
import Marked from "@/components/status/Marked";
import MarkedAnswered from "@/components/status/MarkedAnswered";
import NotAnswered from "@/components/status/NotAnswered";
import NotVisited from "@/components/status/NotVisited";
import { isAnswered, isMarkedReview } from "@/utils/questionUtils";

export function SubjectOverviewCarouselItem({
  subject: s,
}: {
  subject: ExamDetailData["subjects"][0];
}) {
  const { examData } = useExamData();
  return (
    <div key={`card_${s.sub_id}`} className="w-full bg-white px-3 py-2">
      <>
        <div className="grid grid-cols-2 font-medium text-xs gap-2 justify-between tracking-tight">
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 flex items-center justify-center bg-gray-100">
              {s.questions.length}
            </div>
            Total Questions
          </div>
          <div className="flex gap-2 items-center">
            <Answered
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length
              }
            />
            Answered
          </div>
          <div className="flex gap-2 items-center">
            <NotAnswered
              value={
                s.questions.length -
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isAnswered(a)
                ).length
              }
            />
            UnAnswered
          </div>
          <div className="flex gap-2 items-center">
            <Marked
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id && isMarkedReview(a)
                ).length
              }
            />
            Marked
          </div>
          <div className="flex gap-2 items-center">
            <MarkedAnswered
              value={
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) =>
                    a.sub_id == s.sub_id && isMarkedReview(a) && isAnswered(a)
                ).length
              }
            />
            Marked Answer
          </div>
          <div className="flex gap-2 items-center">
            <NotVisited
              value={
                s.questions.length -
                Object.values(examData.studentExamState.student_answers).filter(
                  (a) => a.sub_id == s.sub_id
                ).length
              }
            />
            Not Visited
          </div>
        </div>
      </>
    </div>
  );
}
