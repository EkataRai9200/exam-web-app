import { Badge } from "@/components/ui/badge";

function EnglishInstructionsContent() {
  return (
    <div>
      <p className="font-semibold underline">General Instructions:</p>

      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2">
        <li>
          The clock has been set at the server and the countdown timer at the
          top right corner of your screen will display the time remaining for
          you to complete the exam. When the clock runs out the exam ends by
          default - you are not required to end or submit your exam.{" "}
        </li>
        <li>
          The question palette at the right of the screen shows one of the
          following statuses of each of the questions numbered:
          <div className="flex flex-col gap-2">
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-200 text-dark">
                1
              </Badge>
              <span>You have not visited the question yet.</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-600">
                1
              </Badge>
              <span>You have not answered the question.</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-600">
                1
              </Badge>
              <span>You have answered the question.</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-600">
                1
              </Badge>
              <span>
                You have NOT answered the question but have marked the question
                for review.
              </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600">
                1
              </Badge>
              <span>
                You have answered the question but marked it for review.
              </span>
            </div>
          </div>
          <p className="mt-2">
            The Marked for Review status simply acts as a reminder that you have
            set to look at the question again.{" "}
            <span className="text-red-600">
              <i>
                If an answer is selected for a question that is Marked for
                Review, the answer will be considered in the final evaluation.
              </i>
            </span>
          </p>
        </li>
      </ol>
      <p className="font-semibold underline">Navigating to a question :</p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={4}>
        <li>
          To select a question to answer, you can do one of the following:
          <ol className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2">
            <li>
              Click on the question number on the question palette at the right
              of your screen to go to that numbered question directly. Note that
              using this option does NOT save your answer to the current
              question.{" "}
            </li>
            <li>
              Click on Save and Next to save the answer to the current question
              and to go to the next question in sequence.
            </li>
            <li>
              Click on Mark for Review and Next to save the answer to the
              current question, mark it for review, and to go to the next
              question in sequence.
            </li>
          </ol>
        </li>
        <li>
          You can view the entire paper by clicking on the <b>Question Paper</b>{" "}
          button.
        </li>
      </ol>
      <p className="font-semibold underline">Answering questions :</p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={6}>
        <li>
          For multiple choice type questions :
          <ol
            className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2"
            type="a"
          >
            <li>To select your answer, click on one of the option buttons</li>
            <li>To change your answer, click another desired option button</li>
            <li>
              To save your answer, you MUST click on <b>Save &amp; Next</b>{" "}
            </li>
            <li>
              To deselect a chosen answer, click on the chosen option again or
              click on the <b>Clear Response</b> button.
            </li>
            <li>
              To mark a question for review click on{" "}
              <b>Mark for Review &amp; Next</b>.{" "}
              <span className="text-red-600">
                <i>
                  If an answer is selected for a question that is Marked for
                  Review, the answer will be considered in the final evaluation.{" "}
                </i>
              </span>
            </li>
          </ol>
        </li>
        <li>
          To change an answer to a question, first select the question and then
          click on the new answer option followed by a click on the{" "}
          <b>Save &amp; Next</b> button.
        </li>
        <li>
          Questions that are saved or marked for review after answering will
          ONLY be considered for evaluation.
        </li>
      </ol>
      <p className="font-semibold underline">Navigating through sections :</p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={9}>
        <li>
          Sections in this question paper are displayed on the top bar of the
          screen. Questions in a section can be viewed by clicking on the
          section name. The section you are currently viewing is highlighted.
        </li>
        <li>
          After clicking the <b>Save &amp; Next</b> button on the last question
          for a section, you will automatically be taken to the first question
          of the next section.{" "}
        </li>
        <li>
          You can move the mouse cursor over the section names to view the
          status of the questions for that section.{" "}
        </li>
        <li>
          You can shuffle between sections and questions anytime during the
          examination as per your convenience.{" "}
        </li>
      </ol>
    </div>
  );
}

export default EnglishInstructionsContent;
