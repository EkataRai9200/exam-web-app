import Loader from "@/components/blocks/Loader";
import { LanguageDropdown } from "@/components/exams/language/LanguageDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExamDetailData } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { ExamTokenData } from "@/types/exams/ExamToken";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [selectedLang] = useState("EN");

  return (
    <Card className="py-2" x-chunk="dashboard-04-chunk-1">
      <CardContent className={clsx("h-[60vh] overflow-y-auto")}>
        <div>
          <div>
            {selectedLang === "EN" && (
              <div>
                <p>
                  <strong>
                    <b>Please read the following instructions carefully</b>
                  </strong>
                </p>
                <p>
                  <strong>
                    <u>General Instructions:</u>
                  </strong>{" "}
                  <br />
                </p>
                <ol>
                  <li>
                    The clock has been set at the server and the countdown timer
                    at the top right corner of your screen will display the time
                    remaining for you to complete the exam. When the clock runs
                    out the exam ends by default - you are not required to end
                    or submit your exam.{" "}
                  </li>
                  <li>
                    The question palette at the right of the screen shows one of
                    the following statuses of each of the questions numbered:
                    <table>
                      <tbody>
                        <tr>
                          <td valign="top" className="btn-in-inst btn_nv">
                            <button id="tooltip_not_visited">1</button>
                          </td>
                          <td>You have not visited the question yet.</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td valign="top" className="btn-in-inst btn_na">
                            <button id="tooltip_not_answered">3</button>
                          </td>
                          <td>You have not answered the question.</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td valign="top" className="btn-in-inst btn_a">
                            <button id="tooltip_answered">5</button>
                          </td>
                          <td>You have answered the question. </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td valign="top" className="btn-in-inst btn_m">
                            <button id="tooltip_review">7</button>
                          </td>
                          <td>
                            You have NOT answered the question but have marked
                            the question for review.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td valign="top" className="btn-in-inst btn_ma">
                            <button id="tooltip_reviewanswered">9</button>
                          </td>
                          <td>
                            You have answered the question but marked it for
                            review.{" "}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                  <li style={{ listStyleType: "none" }}>
                    The Marked for Review status simply acts as a reminder that
                    you have set to look at the question again.{" "}
                    <span color="red">
                      <i>
                        If an answer is selected for a question that is Marked
                        for Review, the answer will be considered in the final
                        evaluation.
                      </i>
                    </span>
                  </li>
                </ol>
                <p>
                  <br />
                  <b>
                    <u>Navigating to a question : </u>
                  </b>
                </p>
                <ol start={4}>
                  <li>
                    To select a question to answer, you can do one of the
                    following:
                    <ol type="a">
                      <li>
                        Click on the question number on the question palette at
                        the right of your screen to go to that numbered question
                        directly. Note that using this option does NOT save your
                        answer to the current question.{" "}
                      </li>
                      <li>
                        Click on Save and Next to save the answer to the current
                        question and to go to the next question in sequence.
                      </li>
                      <li>
                        Click on Mark for Review and Next to save the answer to
                        the current question, mark it for review, and to go to
                        the next question in sequence.
                      </li>
                    </ol>
                  </li>
                  <li>
                    You can view the entire paper by clicking on the{" "}
                    <b>Question Paper</b> button.
                  </li>
                </ol>
                <p>
                  <br />
                  <b>
                    <u>Answering questions : </u>
                  </b>
                </p>
                <ol start={6}>
                  <li>
                    For multiple choice type questions :
                    <ol type="a">
                      <li>
                        To select your answer, click on one of the option
                        buttons
                      </li>
                      <li>
                        To change your answer, click another desired option
                        button
                      </li>
                      <li>
                        To save your answer, you MUST click on{" "}
                        <b>Save &amp; Next</b>{" "}
                      </li>
                      <li>
                        To deselect a chosen answer, click on the chosen option
                        again or click on the <b>Clear Response</b> button.
                      </li>
                      <li>
                        To mark a question for review click on{" "}
                        <b>Mark for Review &amp; Next</b>.{" "}
                        <span color="red">
                          <i>
                            If an answer is selected for a question that is
                            Marked for Review, the answer will be considered in
                            the final evaluation.{" "}
                          </i>
                        </span>
                      </li>
                    </ol>
                  </li>
                  <li>
                    To change an answer to a question, first select the question
                    and then click on the new answer option followed by a click
                    on the <b>Save &amp; Next</b> button.
                  </li>
                  <li>
                    Questions that are saved or marked for review after
                    answering will ONLY be considered for evaluation.
                  </li>
                </ol>
                <p>
                  <br />
                  <b>
                    <u>Navigating through sections : </u>
                  </b>
                </p>
                <ol start={9}>
                  <li>
                    Sections in this question paper are displayed on the top bar
                    of the screen. Questions in a section can be viewed by
                    clicking on the section name. The section you are currently
                    viewing is highlighted.
                  </li>
                  <li>
                    After clicking the <b>Save &amp; Next</b> button on the last
                    question for a section, you will automatically be taken to
                    the first question of the next section.{" "}
                  </li>
                  <li>
                    You can move the mouse cursor over the section names to view
                    the status of the questions for that section.{" "}
                  </li>
                  <li>
                    You can shuffle between sections and questions anytime
                    during the examination as per your convenience.{" "}
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-2 py-2 flex justify-center gap-1 relative">
        <Button onClick={() => setInstructionsPage(2)} size={"lg"}>
          Next <ChevronRight />
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

    await fetch(`${examData.authUser?.api_url}/start_exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test_id: examData._id.$oid,
        webtesttoken: examData.authUser?.webtesttoken,
      }),
    });
    // const res = await api.json();
  };

  const [termsChecked, setTermsChecked] = useState(false);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  return (
    <Card className="py-2" x-chunk="dashboard-04-chunk-1">
      <CardContent className={clsx("h-[60vh] overflow-y-auto")}>
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
                  I have read and understood the instructions. All Computer
                  Hardwares allotted to me are in proper working condition. I
                  agree that I am not carrying any prohibited gadget like mobile
                  phone etc. / any prohibited material with me into the exam
                  hall. I agree that in case of not adhering to the
                  instructions, I will be disqualified from taking the exam.
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
          {/* Previous */}
        </Button>
        <Button
          variant={"default"}
          size={"lg"}
          disabled={!termsChecked}
          onClick={handleStartExam}
        >
          Start Exam
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
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          {examData.test_name}
        </h2>
        <LanguageDropdown />

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
