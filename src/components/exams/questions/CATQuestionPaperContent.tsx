import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function CATQuestionPaperContent({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const { examData } = useExamData();
  console.log(examData);
  return (
    <>
      <div
        className={cn(
          "fixed md:fixed h-screen w-full top-0 left-0 bg-[rgba(0,0,0,.5)] z-20",
          open ? "visible" : "hidden"
        )}
      ></div>
      <div
        className={cn(
          "fixed flex flex-col  h-[calc(100vh-100px)] w-[90%] margin-auto left-[5%] top-[50px] bg-white md:z-30",
          open ? "visible" : "hidden"
        )}
      >
        <div className="bg-blue-600 text-white px-5 mb-2 flex justify-between">
          <h1 className="w-full text-start text-sm py-1 font-medium">
            {examData.subjects[examData.studentExamState.activeSubject].name}
          </h1>
          <button
            className="p-0 flex text-xs justify-center items-center"
            onClick={() => setOpen(false)}
            type="button"
          >
            close <X className="text-gray-300 ms-1" size={16} />
          </button>
        </div>
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
      </div>
    </>
  );
}

export default CATQuestionPaperContent;
