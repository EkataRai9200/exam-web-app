import Loader from "@/components/blocks/Loader";
import CATEnglishInstructionsContent from "@/components/exams/instructions/content/CATEnglishInstructionsContent";
import HindiInstructionsContent from "@/components/exams/instructions/content/HindiInstructionsContent";
import IndonesiaInstructionsContent from "@/components/exams/instructions/content/IndonesiaInstructionsContent";
import { CATLanguageDropdown } from "@/components/exams/language/CATLanguageDropdown";
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
import { cx } from "class-variance-authority";
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
        <CATEnglishInstructionsContent />
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

const Instructions2 = ({}: { termsChecked: boolean; setTermsChecked: any }) => {
  const { examData } = useExamData();

  return (
    <>
      <div className="flex flex-col justify-between relative">
        <div className="h-[100%] w-full md:p-5 overflow-y-auto">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: examData.instructions.description,
            }}
          ></div>
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
    }

    navigate({
      pathname: "/cat-exam/take",
      search: searchParams.toString(),
    });
  };
  const [termsChecked, setTermsChecked] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = `${examData.test_name}`;
    if (data.examData._id.$oid) {
      dispatch({
        type: "init",
        payload: { ...data.examData, authUser: data.authUser },
      });

      if (data.examData?.start_date) {
        // dispatch({ type: "start_exam", payload: data.examData?.start_date });
        navigate({
          pathname: "/cat-exam/take",
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
    <main
      className="flex flex-1 flex-col   overflow-hidden min-h-screen w-full"
      // style={{ fontFamily: "Levenim MT !important" }}
    >
      <div className="flex items-center bg-[#3b5998] text-center shadow z-10 justify-center px-2 py-2">
        <div className="flex items-center">
          {/* {examData.authUser && (
            <img
              src={`${examData.authUser.institute.logo}`}
              className="h-[20px] object-scale-down me-3 hidden md:block max-h-[20px]"
              alt=""
            />
          )} */}

          <h2 className="scroll-m-20 text-xs md:text-sm font-semibold tracking-tight first:mt-0 text-white">
            {examData.test_name}
          </h2>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col relative md:w-4/5">
          <div className="flex flex-row justify-between p-2 bg-[#BCE8F5]">
            <h3 className="scroll-m-20 text-start text-md md:text-md font-bold tracking-tight pb-0 pt-0 text-[#676568]">
              {examData.studentExamState.activeLang == "EN" ||
              examData.test_second_language == "Indonesia"
                ? "Instructions"
                : "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें"}
            </h3>
            <div className="w-[150px]">
              <CATLanguageDropdown />
            </div>
          </div>
          <ScrollArea
            className={cx(
              " bg-white overflow-y-auto py-2 px-2 m-0 md:mx-2 font-serif text-sm",
              InstructionsPage == 1
                ? "h-[calc(80vh)] md:h-[calc(100vh-150px)]"
                : "h-[calc(80vh)] md:h-[calc(100vh-230px)]"
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
          </ScrollArea>
          {InstructionsPage == 2 ? (
            <>
              <div className="flex pt-5 ps-10 border-t-2 space-x-2 md:gap-2">
                <Checkbox
                  id="terms"
                  checked={termsChecked}
                  onClick={() => setTermsChecked(!termsChecked)}
                />
                <label htmlFor="terms" className="text-sm md:text-md ">
                  {examData.studentExamState.activeLang == "EN"
                    ? `I agree to the above terms and conditions for this examination.`
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
            </>
          ) : (
            ""
          )}
          <div
            className={cx(
              "w-full overflow-hidden flex items-center justify-center gap-1 relative",
              {
                "border-t-2 pt-3 pb-3": InstructionsPage == 1,
                "pt-6 pb-6": InstructionsPage == 2,
              }
            )}
          >
            {InstructionsPage == 1 ? (
              <Button
                // className="bg-blue-600 hover:bg-blue-800"
                variant={"outline"}
                onClick={() => {
                  setInstructionsPage(2);
                }}
                size={"lg"}
              >
                Next <ArrowRight size={15} className="ms-2" />
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
                  size={"lg"}
                >
                  <ChevronLeft />{" "}
                  <span className="hidden md:block">Previous</span>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="z-10 bg-blue-600 hover:bg-blue-800"
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
        </div>
        <div className="hidden md:flex bg-white flex-col justify-start pt-10 border-l-2 border-gray-800 md:w-1/5">
          {examData.authUser && (
            <div className="flex flex-col gap-2 justify-start h-[50px] items-center p-2 bg-white">
              <Avatar className="w-[100px] h-[100px]">
                <AvatarImage
                  src={examData.authUser.profile_pic}
                  className="object-cover"
                />
                <AvatarFallback>
                  {examData.authUser.firstname[0] +
                    examData.authUser.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-md md:text-lg">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
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
    `${decoded.api_url}/generateTestTokenForStudentInternal/${decoded.test_id}?token=${token}`
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
    `${decoded.api_url}/get-test-details/${decoded.package_id}/${
      decoded.test_series_id
    }/${decoded.test_id}/${
      decoded.is_preview ? "preview" : "undefined"
    }?webtesttoken=${webtesttoken}`
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
