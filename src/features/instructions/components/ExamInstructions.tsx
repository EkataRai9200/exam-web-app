import EnglishInstructionsContent from "@/features/instructions/components/content/EnglishInstructionsContent";
import HindiInstructionsContent from "@/features/instructions/components/content/HindiInstructionsContent";
import IndonesiaInstructionsContent from "@/features/instructions/components/content/IndonesiaInstructionsContent";
import { useExamData } from "@/lib/hooks";

const ExamInstructions = () => {
  const { examData } = useExamData();

  return (
    <>
      {examData.studentExamState.activeLang === "EN" && (
        <EnglishInstructionsContent />
      )}
      {examData.studentExamState.activeLang === "HI" && (
        <>
          {examData.test_second_language == "Indonesia" ? (
            <IndonesiaInstructionsContent />
          ) : (
            <HindiInstructionsContent />
          )}
        </>
      )}
    </>
  );
};
export default ExamInstructions;
