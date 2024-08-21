import Loader from "@/components/blocks/Loader";
import EnglishInstructionsContent from "@/components/exams/instructions/content/EnglishInstructionsContent";
import HindiInstructionsContent from "@/components/exams/instructions/content/HindiInstructionsContent";
import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExamDetailData } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { requestFullScreen } from "@/lib/utils";
import { ExamTokenData } from "@/types/exams/ExamToken";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
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
        <div className="h-[30%] md:h-[20%] flex flex-col md:items-start items-start gap-4 border-t-2 rounded-lg overflow-y-auto p-2 md:p-5">
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
              Please note all questions will appear in your default language.
              This language can be changed for a particular question later on
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
              {examData.studentExamState.activeLang == "HI"
                ? `मैंने पढ़ा है और निर्देश समझ लिया है। मेरे लिए आवंटित सभी कंप्यूटर हार्डवेयर उचित हालत में काम कर रहे हैं। मुझे लगता है मैं परीक्षा हॉल में मेरे साथ आदि मोबाइल फोन की तरह किसी भी निषिद्ध गैजेट / किसी भी निषिद्ध सामग्री नहीं ले जा रहा है कि इस बात से सहमत । मैं निर्देशों का पालन नहीं करने के मामले में , मुझे लगता है कि परीक्षा लेने से अयोग्य घोषित कर दिया जाएगा सहमत हैं।`
                : ""}
            </label>
          </div>
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

    if (examData.is_proctoring_allow) {
      requestFullScreen();
      let win = window.open(
        examData.authUser?.api_url + "/launch-webcam/" + examData._id.$oid,
        "Trigrexam Procter",
        "width=400,height=400,scrollbars=no,location=no"
      );
      window.onunload = function () {
        win?.close();
      };
    }

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
  const disableCopyPaste = (e: any) => {
    e.preventDefault();
  };
  React.useEffect(() => {
    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    return () => {
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col bg-white  overflow-hidden min-h-screen w-full">
      <div className="flex items-center shadow z-10 justify-between px-2 py-2">
        <div className="flex items-center">
          {examData.authUser && (
            <img
              src={`${examData.authUser.institute.logo}`}
              width={100}
              className="me-3 hidden md:block"
              alt=""
            />
          )}

          <h2 className="scroll-m-20 text-xs md:text-sm font-semibold tracking-tight first:mt-0">
            {examData.test_name}
          </h2>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col relative md:w-4/5">
          <div className="flex flex-row justify-end p-2">
            <div className="w-[150px]">
              <LanguageDropdown />
            </div>
          </div>
          <ScrollArea className="h-[calc(80vh)] md:h-[calc(100vh-150px)] bg-white overflow-y-auto py-2 px-2 m-0 md:mx-2 font-serif text-sm">
            <h3 className="scroll-m-20 text-center text-md md:text-md font-bold tracking-tight pb-0 pt-2">
              {examData.studentExamState.activeLang == "EN"
                ? "Please read the following instructions carefully"
                : "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें"}
            </h3>
            {InstructionsPage == 1 ? <Instructions /> : ""}
            {InstructionsPage == 2 ? (
              <Instructions2
                termsChecked={termsChecked}
                setTermsChecked={setTermsChecked}
              />
            ) : (
              ""
            )}
          </ScrollArea>
          <div className="w-full overflow-hidden flex items-center justify-center gap-1 relative">
            {InstructionsPage == 1 ? (
              <Button
                className="bg-green-600 hover:bg-green-800"
                onClick={() => setInstructionsPage(2)}
                size={"default"}
              >
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
                        className="z-10 bg-green-600 hover:bg-green-800"
                        variant={"default"}
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
        </div>
        <div className="hidden md:flex bg-white flex-col justify-center border-l md:w-1/5">
          {examData.authUser && (
            <div className="flex flex-col gap-2 justify-start h-[50px] items-center p-2 bg-white">
              <Avatar className="w-[60px] h-[60px]">
                <AvatarImage
                  src={examData.authUser.profile_pic}
                  className="object-cover"
                />
                <AvatarFallback>
                  {examData.authUser.firstname[0] +
                    examData.authUser.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm md:text-md">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
            </div>
          )}
        </div>
      </div>

      <Loader visible={showLoading} />
    </main>
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
