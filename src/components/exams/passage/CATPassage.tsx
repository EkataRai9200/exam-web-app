import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";

function CATPassage({
  index,
  isActive,
  subjectIndex,
}: {
  index: number;
  isActive: boolean;
  subjectIndex: number;
}) {
  const { examData } = useExamData();
  const question = examData.subjects[subjectIndex].questions[index];
  return (
    <div
      className={cn(
        "w-full p-2 rounded-none border-0 border-r-2 border-gray-700",
        isActive && examData.passage_with_qs ? "visible" : "hidden",
        examData.passage_alignment == "Left" ? "md:w-1/2" : ""
      )}
    >
      <div className="">
        {question.passage_desc.length > 0 &&
          examData.studentExamState.activeLang == "EN" && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: question.passage_desc[0].passage,
              }}
            />
          )}
        {question.hi_passage_desc.length > 0 &&
          examData.studentExamState.activeLang == "HI" && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: question.hi_passage_desc[0].passage,
              }}
            />
          )}
      </div>
    </div>
  );
}

export default CATPassage;
