import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/utils/common";

function QuestionPaperContent({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const { examData } = useExamData();
  // console.log(examData)
  return (
    <div
      className={cn(
        "fixed md:absolute  flex flex-col h-screen md:h-full w-full top-0 left-0 bg-white z-50 md:z-20",
        open ? "visible" : "hidden"
      )}
    >
      <h1 className="w-full text-center py-2 font-medium bg-gray-50">
        {examData.subjects[examData.studentExamState.activeSubject].name}
      </h1>
      <ScrollArea className="pb-5 px-5">
        {examData.subjects[
          examData.studentExamState.activeSubject
        ].questions.map((question, index) => {
          return (
            <div key={`question_${index}`} className="mt-2 border-b pb-2">
              <h3 className="font-bold">{`Q${index + 1}.`}</h3>
              <div
                className="no-tailwindcss-base ck-editor text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    question.passage_desc?.[0]?.passage ||
                    question.hi_passage_desc?.[0]?.passage ||
                    "",
                }}
              ></div>

              <div
                className="no-tailwindcss-base ck-editor text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    examData.studentExamState.activeLang == "EN"
                      ? question.question
                      : question.hi_question ?? "",
                }}
              ></div>
            </div>
          );
        })}
      </ScrollArea>
      <div className="flex justify-center py-2">
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Back
        </Button>
      </div>
    </div>
  );
}

export default QuestionPaperContent;
