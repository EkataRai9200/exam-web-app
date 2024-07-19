import Loader from "@/components/blocks/Loader";
import EnglishInstructionsContent from "@/components/exams/instructions/content/EnglishInstructionsContent";
import HindiInstructionsContent from "@/components/exams/instructions/content/HindiInstructionsContent";
import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExamDetailData } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { ExamTokenData } from "@/types/exams/ExamToken";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Instructions = ({
  // InstructionsPage,
  setInstructionsPage,
}: {
  InstructionsPage: any;
  setInstructionsPage: any;
}) => {
  const { examData } = useExamData();

  return (
    <Card>
      <CardContent className={clsx("py-3")}>
        {examData.studentExamState.activeLang === "EN" && (
          <EnglishInstructionsContent />
        )}
        {examData.studentExamState.activeLang === "HI" && (
          <HindiInstructionsContent />
        )}
      </CardContent>
      <CardFooter className="border-t px-2 py-2 flex justify-center gap-1 relative">
        <Button onClick={() => setInstructionsPage(2)} size={"lg"}>
          Proceed <ArrowRight size={15} className="ms-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Instructions2 = ({
  // InstructionsPage,
  setInstructionsPage,
}: {
  InstructionsPage: any;
  setInstructionsPage: any;
}) => {
  const { examData, dispatch } = useExamData();

  const handleStartExam = async () => {
    dispatch({ type: "start_exam", payload: Date.now() });
    navigate({
      pathname: "/take",
      search: searchParams.toString(),
    });

    // await fetch(`${examData.authUser?.api_url}/start_exam`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     test_id: examData._id.$oid,
    //     webtesttoken: examData.authUser?.webtesttoken,
    //   }),
    // });
    // const res = await api.json();
  };

  const [termsChecked, setTermsChecked] = useState(false);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  return (
    <Card className="py-2">
      <CardContent className={clsx("min-h-[200px]")}>
        <div className="tl-page1">
          <div className="tl-content">
            <div className="flex flex-col justify-end gap-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: examData.instructions.description,
                }}
              ></div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsChecked}
                  onClick={() => setTermsChecked(!termsChecked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-wide"
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
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-2 py-2 flex justify-center gap-1 relative">
        <Button
          className="absolute left-5"
          variant={"outline"}
          onClick={() => setInstructionsPage(1)}
          size={"sm"}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant={"default"}
          size={"lg"}
          disabled={!termsChecked}
          onClick={handleStartExam}
        >
          {"Start Exam"}
          {/* <Link to={"/take"}>Start Exam</Link> */}
        </Button>
      </CardFooter>
    </Card>
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
      <main className="flex flex-1 flex-col gap-3 md:gap-5 bg-slate-100/50 p-2 md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
            {examData.test_name}
          </h2>
          <div className="w-100">
            <LanguageDropdown />
          </div>
        </div>
        <h3 className="scroll-m-20 text-center text-xl font-semibold tracking-tight">
          {examData.studentExamState.activeLang == "EN"
            ? "Please read the following instructions carefully"
            : "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें"}
        </h3>
        {InstructionsPage == 1 ? (
          <Instructions
            InstructionsPage={1}
            setInstructionsPage={setInstructionsPage}
          />
        ) : (
          ""
        )}
        {InstructionsPage == 2 ? (
          <Instructions2
            InstructionsPage={1}
            setInstructionsPage={setInstructionsPage}
          />
        ) : (
          ""
        )}

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
