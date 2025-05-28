import { Checkbox } from "@/components/ui/checkbox";
import { LanguageDropdown } from "@/features/language/LanguageDropdown";
import { useExamData } from "@/lib/hooks";

const UserInstructions = ({
  termsChecked,
  setTermsChecked,
}: {
  termsChecked: boolean;
  setTermsChecked: any;
}) => {
  const { examData } = useExamData();

  return (
    <>
      <div className="justify-start h-[calc(100vh-250px)] relative">
        <div className="h-[70%] w-full md:p-5 overflow-y-auto">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: examData.instructions.description,
            }}
          ></div>
        </div>
        <div className="h-[30%] flex flex-col md:items-start items-start gap-4 border-t-2 rounded-lg overflow-y-visible p-2 md:p-5">
          <div className="flex items-center gap-2 text-slate-700">
            <div>
              <p className="text-sm">Choose your default language: </p>
            </div>
            <div className="w-[100px]">
              <LanguageDropdown />
            </div>
          </div>
          <div>
            <p>
              {examData.test_second_language != "Indonesia"
                ? "Please note all questions will appear in your default language. This language can be changed for a particular question later on"
                : ""}
              {examData.studentExamState.activeLang == "HI" &&
              examData.test_second_language == "Indonesia"
                ? "Harap perhatikan, Anda harus menyetujui persyaratan ujian yang ditetapkan dengan mengklik tanda di bawah ini."
                : ""}
            </p>
          </div>
          <div className="flex space-x-2 md:gap-2">
            <Checkbox
              id="terms"
              checked={termsChecked}
              onClick={() => setTermsChecked(!termsChecked)}
            />
            <label htmlFor="terms" className="text-sm md:text-md ">
              {examData.studentExamState.activeLang == "EN"
                ? `I have read and understood the instructions. All Computer
                  Hardwares allotted to me are in proper working condition. I
                  agree that I am not carrying any prohibited gadget like mobile
                  phone etc. / any prohibited material with me into the exam
                  hall. I agree that in case of not adhering to the
                  instructions, I will be disqualified from taking the exam.`
                : ""}
              {examData.studentExamState.activeLang == "HI" &&
              examData.test_second_language != "Indonesia"
                ? `मैंने पढ़ा है और निर्देश समझ लिया है। मेरे लिए आवंटित सभी कंप्यूटर हार्डवेयर उचित हालत में काम कर रहे हैं। मुझे लगता है मैं परीक्षा हॉल में मेरे साथ आदि मोबाइल फोन की तरह किसी भी निषिद्ध गैजेट / किसी भी निषिद्ध सामग्री नहीं ले जा रहा है कि इस बात से सहमत । मैं निर्देशों का पालन नहीं करने के मामले में , मुझे लगता है कि परीक्षा लेने से अयोग्य घोषित कर दिया जाएगा सहमत हैं।`
                : ""}
              {examData.studentExamState.activeLang == "HI" &&
              examData.test_second_language == "Indonesia"
                ? `Saya telah membaca dan memahami petunjuknya, dan saya siap untuk memulai ujian`
                : ""}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInstructions;
