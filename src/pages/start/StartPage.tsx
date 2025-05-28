import Loader from "@/features/loader/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExamDetailData } from "@/context/ExamContext";
import ExamInstructions from "@/features/instructions/components/ExamInstructions";
import UserInstructions from "@/features/instructions/components/UserInstructions";
import { LanguageDropdown } from "@/features/language/LanguageDropdown";
import { useExamData } from "@/lib/hooks";
import { requestFullScreen } from "@/utils/common";
import { generateWebTestToken } from "@/services/authService";
import { fetchTestDetails } from "@/services/examService";
import { ArrowRight, ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

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
      pathname: "/take",
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
              className="h-[50px] object-scale-down me-3 hidden md:block"
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
          <ScrollArea className="h-[calc(80vh)] md:h-[calc(100vh-180px)] bg-white overflow-y-auto py-2 px-2 m-0 md:mx-2 font-serif text-sm">
            <h3 className="scroll-m-20 text-center text-md md:text-md font-bold tracking-tight pb-0 pt-2">
              {examData.studentExamState.activeLang == "EN" ||
              examData.test_second_language == "Indonesia"
                ? "Please read the following instructions carefully"
                : "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें"}
            </h3>
            {InstructionsPage == 1 ? <ExamInstructions /> : ""}
            {InstructionsPage == 2 ? (
              <UserInstructions
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
                className="bg-blue-600 hover:bg-blue-800"
                onClick={() => {
                  setInstructionsPage(2);
                }}
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
                        className="z-10 bg-blue-600 hover:bg-blue-800"
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

export const StartPageLoaderData = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  // authenticate
  // call api here
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const authUser = await generateWebTestToken(token);

  const examData = await fetchTestDetails(token, authUser.webtesttoken);

  return { ...params, authUser, examData };
};
