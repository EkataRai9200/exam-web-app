import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

function Passage({
  index,
  isActive,
  subjectIndex,
}: {
  index: number;
  isActive: boolean;
  subjectIndex: number;
}) {
  const { examData } = useExamData();
  const [showPassage, setShowPassage] = React.useState(true);
  const question = examData.subjects[subjectIndex].questions[index];
  return (
    <Card
      className={cn(
        "w-full md:w-1/2 mt-2",
        isActive && examData.passage_with_qs ? "visible" : "hidden"
      )}
    >
      <CardHeader className="relative px-3 py-1">
        <div className="pt-1">
          <p className="text-sm text-muted-foreground">Passage</p>
          <Button
            onClick={() => setShowPassage(!showPassage)}
            size="sm"
            type="button"
            variant="ghost"
            className="p-2 h-7 absolute right-2 top-1 md:hidden"
          >
            {showPassage ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent
        className={cn("px-3", showPassage ? "block" : "hidden", "md:!block")}
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
      </CardContent>
    </Card>
  );
}

export default Passage;
