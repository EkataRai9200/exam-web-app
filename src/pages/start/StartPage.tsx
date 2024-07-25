import Loader from "@/components/blocks/Loader";
import EnglishInstructionsContent from "@/components/exams/instructions/content/EnglishInstructionsContent";
import HindiInstructionsContent from "@/components/exams/instructions/content/HindiInstructionsContent";
import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExamDetailData } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ExamTokenData } from "@/types/exams/ExamToken";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Instructions = () => {
  const { examData } = useExamData();

  return (
    <>
      {examData.studentExamState.activeLang === "EN" && (
        <EnglishInstructionsContent />
      )}
      {examData.studentExamState.activeLang === "HI" && (
        <HindiInstructionsContent />
      )}
    </>
  );
};

const Instructions2 = ({
  termsChecked,
  setTermsChecked,
}: {
  termsChecked: boolean;
  setTermsChecked: any;
}) => {
  const { examData } = useExamData();

  return (
    <>
      <div className="flex flex-col justify-start h-full relative">
        <div
          className="h-[70%] md:h-[80%] md:p-5 prose overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: examData.instructions.description,
          }}
        ></div>
        <div className="h-[30%] md:h-[20%] flex md:items-center items-start space-x-2 border-t-2 rounded-lg overflow-y-auto p-2 md:p-5">
          <Checkbox
            id="terms"
            checked={termsChecked}
            onClick={() => setTermsChecked(!termsChecked)}
          />
          <label
            htmlFor="terms"
            className="text-sm md:text-md text-gray-700 font-bold"
          >
            {examData.studentExamState.activeLang == "EN"
              ? `I have read and understood the instructions. All Computer
                  Hardwares allotted to me are in proper working condition. I
                  agree that I am not carrying any prohibited gadget like mobile
                  phone etc. / any prohibited material with me into the exam
                  hall. I agree that in case of not adhering to the
                  instructions, I will be disqualified from taking the exam.`
              : ""}
            {examData.studentExamState.activeLang == "HI"
              ? `मैंने पढ़ा है और निर्देश समझ लिया है। मेरे लिए आवंटित सभी कंप्यूटर हार्डवेयर उचित हालत में काम कर रहे हैं। मुझे लगता है मैं परीक्षा हॉल में मेरे साथ आदि मोबाइल फोन की तरह किसी भी निषिद्ध गैजेट / किसी भी निषिद्ध सामग्री नहीं ले जा रहा है कि इस बात से सहमत । मैं निर्देशों का पालन नहीं करने के मामले में , मुझे लगता है कि परीक्षा लेने से अयोग्य घोषित कर दिया जाएगा सहमत हैं।`
              : ""}
          </label>
        </div>
      </div>
    </>
  );
};

export function StartPage() {
  const [InstructionsPage, setInstructionsPage] = useState(1);

  const { examData, dispatch } = useExamData();

  const data = useLoaderData() as {
    authUser: ExamDetailData["authUser"];
    examData: ExamDetailData;
  };

  const [showLoading, setShowLoading] = useState(true);

  const handleStartExam = async () => {
    dispatch({ type: "start_exam", payload: Date.now() });
    navigate({
      pathname: "/take",
      search: searchParams.toString(),
    });
  };
  const [termsChecked, setTermsChecked] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (data.examData._id.$oid) {
      dispatch({
        type: "init",
        payload: { ...data.examData, authUser: data.authUser },
      });

      if (data.examData?.start_date) {
        // dispatch({ type: "start_exam", payload: data.examData?.start_date });
        navigate({
          pathname: "/take",
          search: searchParams.toString(),
        });
      }
      setShowLoading(false);
    }
  }, [data]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col bg-slate-200/50">
        <div className="h-[15vh] md:h-[100px] overflow-hidden">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center">
              {/* <img
                src="https://trigrexam.com/app/assets/front/images/logo.png"
                width={100}
                alt=""
              /> */}
              <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0 hidden md:block">
                {examData.test_name}
              </h2>
            </div>
            <div className="w-100">
              <LanguageDropdown />
            </div>
          </div>
          <h3 className="scroll-m-20 text-center text-md md:text-xl  font-semibold tracking-tight py-0 px-2">
            {examData.studentExamState.activeLang == "EN"
              ? "Please read the following instructions carefully"
              : "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें"}
          </h3>
        </div>
        <div
          className={cn(
            "h-[calc(75vh)] md:h-[calc(100vh-170px)] bg-white overflow-y-auto py-2 px-2 m-0 md:mx-2"
          )}
        >
          {InstructionsPage == 1 ? <Instructions /> : ""}
          {InstructionsPage == 2 ? (
            <Instructions2
              termsChecked={termsChecked}
              setTermsChecked={setTermsChecked}
            />
          ) : (
            ""
          )}
        </div>
        <div className="w-full h-[10vh]  md:h-[70px] overflow-hidden flex items-center justify-center gap-1 relative">
          {InstructionsPage == 1 ? (
            <Button onClick={() => setInstructionsPage(2)} size={"lg"}>
              Proceed <ArrowRight size={15} className="ms-2" />
            </Button>
          ) : (
            ""
          )}
          {InstructionsPage == 2 ? (
            <>
              <Button
                className="absolute left-5"
                variant={"outline"}
                onClick={() => setInstructionsPage(1)}
                size={"sm"}
              >
                <ChevronLeft />{" "}
                <span className="hidden md:block">Previous</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="z-10"
                      variant={"default"}
                      size={"lg"}
                      disabled={!termsChecked}
                      onClick={handleStartExam}
                    >
                      {"Start Exam"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Please accept terms and condition</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            ""
          )}
        </div>

        <Loader visible={showLoading} />
      </main>
    </div>
  );
}

export const authenticateToken = async (token: string | null) => {
  if (!token || token.length <= 0) {
    throw new Error("Invalid token");
  }

  const decoded = jwtDecode(token as string) as ExamTokenData;

  const data = await fetch(
    `${decoded.api_url}/generateTeskTokenForStudentInternal/${decoded.test_id}?token=${token}`
  );

  const json = await data.json();
  if (!json.status || !json.data || json.status === false) {
    throw new Error("Invalid token");
  }

  return { ...json.data, ...decoded };
};

export const getTestDetails = async (
  token: string | null,
  webtesttoken: string
) => {
  if (!token || token.length <= 0) {
    throw new Error("Invalid token");
  }

  const decoded = jwtDecode(token as string) as ExamTokenData;

  const examReq = await fetch(
    `${decoded.api_url}/get-test-details/${decoded.package_id}/${decoded.test_series_id}/${decoded.test_id}/undefined?webtesttoken=${webtesttoken}`
  );

  const examData = await examReq.json();

  if (!examData.data) {
    throw new Error(examData.msg);
  }

  return examData.data;
};

export const StartPageLoaderData = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  // authenticate
  // call api here
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const authUser = await authenticateToken(token);

  const examData = await getTestDetails(token, authUser.webtesttoken);

  return { ...params, authUser, examData };
};
