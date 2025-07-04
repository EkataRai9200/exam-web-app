import { useExamData } from "@/lib/hooks";

import Answered from "@/components/status/Answered";
import Marked from "@/components/status/Marked";
import MarkedAnswered from "@/components/status/MarkedAnswered";
import NotAnswered from "@/components/status/NotAnswered";
import NotVisited from "@/components/status/NotVisited";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExamDetailData } from "@/context/ExamContext";
import SubjectSubmitOverview from "@/features/overview/SubjectSubmitOverview";
import { calcTotalQs } from "@/pages/submit/SubmitExam";
import { cn } from "@/utils/common";
import {
  isAnswered,
  isMarkedAndAnswered,
  isMarkedReview,
  isNotAnswered,
} from "@/utils/questionUtils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ExamDrawerContent({
  setShowQuestionPaper,
  setShowInstructions,
  setOpenDrawer,
}: {
  setShowQuestionPaper: any;
  setShowInstructions: any;
  setOpenDrawer?: any;
}) {
  const { examData, dispatch, submitExam } = useExamData();

  const MySwal = withReactContent(Swal);

  const canSubmitSection = () => {
    const activeSubData =
      examData.subjects[examData.studentExamState.activeSubject];
    if (activeSubData.qlimit && parseInt(activeSubData.qlimit) > 0) {
      const attemptedNoOfQs = Object.values(
        examData.studentExamState.student_answers
      ).filter((v) => v.sub_id == activeSubData.sub_id && isAnswered(v)).length;

      if (attemptedNoOfQs > parseInt(activeSubData.qlimit)) {
        MySwal.fire(
          `You can attempt a maximum of ${activeSubData.qlimit} questions on this subject`,
          "",
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const submitSection = async () => {
    if (
      examData.studentExamState.activeSubject + 1 <=
      examData.subjects.length - 1
    ) {
      dispatch({
        type: "submit_section",
        payload: {},
      });
    } else {
      submitExam({
        submission_source: "manual",
      });
    }
  };

  const handleSubmitSection = () => {
    if (!canSubmitSection()) return;
    if (setOpenDrawer) setOpenDrawer(false);
    MySwal.fire({
      title: "Are you sure you want to submit this section?",
      html: <SubjectSubmitOverview examData={examData} />,
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      backdrop: "rgba(0, 0, 0, 0.5)",
      confirmButtonText: `Yes`,
      confirmButtonColor: "#22c55e",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        // submit
        submitSection();
      }
    });
  };

  const questionsDataWithNo = (data: ExamDetailData["subjects"]) => {
    let questionNumber = 1;

    return data.map((subject) => ({
      ...subject,
      questions: subject.questions.map((question) => ({
        ...question,
        questionNumber: questionNumber++,
      })),
    }));
  };

  const showSubmitModalHandler = () => {
    dispatch({
      type: "setShowSubmitModal",
      payload: true,
    });
    if (setOpenDrawer) setOpenDrawer(false);
  };

  return (
    <>
      {examData.authUser && (
        <div className="flex flex-row gap-2 justify-start md:h-[50px] items-center p-2 ">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={examData.authUser.profile_pic}
              className="object-cover"
            />
            <AvatarFallback>
              {examData.authUser.firstname[0] + examData.authUser.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-sm">{`${examData.authUser.firstname} ${examData.authUser.lastname}`}</p>
        </div>
      )}

      <div className="grid grid-cols-3 font-medium text-xs gap-1 justify-between p-2 md:h-[85px]">
        <div className="flex gap-1 items-center">
          {/* <Badge className="min-w-5 justify-center px-1 bg-green-600 rounded-md">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isAnswered(a)
              ).length
            }
          </Badge> */}
          <Answered
            className="w-5 h-5"
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isAnswered(a)
              ).length
            }
          />
          Answered
        </div>
        <div className="flex gap-1 items-center">
          <NotAnswered
            className="w-5 h-5"
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isNotAnswered(a)
              ).length
            }
          />
          Not Answered
        </div>
        <div className="flex gap-1 items-center">
          <Marked
            className="w-5 h-5"
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (v) => isMarkedReview(v) && !isAnswered(v)
              ).length
            }
          />
          Marked
        </div>
        <div className="flex gap-1 items-center">
          <MarkedAnswered
            className="w-5 h-5"
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isMarkedAndAnswered(a)
              ).length
            }
          />
          Marked Answer
        </div>
        <div className="flex gap-1 items-center">
          <NotVisited
            className="w-5 h-5"
            value={
              calcTotalQs(examData.subjects) -
              Object.values(examData.studentExamState.student_answers).length
            }
          />
          Not Visited
        </div>
      </div>

      <div className="flex max-w-full overflow-x-auto gap-2 p-2 h-[32px] bg-[#4e85c5]">
        <h3 className="font-medium text-sm text-white">
          {"Section: "}
          {examData.subjects[examData.studentExamState.activeSubject]?.name}
        </h3>
      </div>
      <div className="bg-[#e5f6fd] p-3 pb-0 grid grid-cols-6 auto-rows-max gap-2 mb-5 h-[calc(100%-300px)] md:h-[calc(100%-350px)] overflow-y-auto">
        {questionsDataWithNo(examData?.subjects)[
          examData.studentExamState.activeSubject
        ]?.questions?.map((_v, i) => {
          const sAns = examData.studentExamState.student_answers[_v._id.$oid];
          const isAns = sAns && isAnswered(sAns) ? true : false;
          const isMarkedForReview = sAns && isMarkedReview(sAns) ? true : false;
          const notAnswered = isNotAnswered(sAns);
          const qNo = examData.qorder == "cont" ? _v.questionNumber : i + 1;
          return (
            <div
              key={i}
              onClick={() => {
                dispatch({
                  type: "setActiveQuestion",
                  payload: {
                    index: i,
                    subjectIndex: examData.studentExamState.activeSubject,
                  },
                });
                if (setOpenDrawer) setOpenDrawer(false);
              }}
              className="flex items-start justify-start cursor-pointer"
            >
              {!sAns && !isMarkedForReview && !isAns && (
                <NotVisited value={qNo} />
              )}
              {sAns && notAnswered && <NotAnswered value={qNo} />}
              {!isMarkedForReview && isAns && <Answered value={qNo} />}
              {isMarkedForReview && !isAns && <Marked value={qNo} />}
              {isMarkedForReview && isAns && <MarkedAnswered value={qNo} />}
            </div>
          );
        })}
      </div>
      <div
        className={cn(
          "mt-auto flex flex-col justify-center items-center gap-2 p-4 py-0 border-t-2 border-blue-200 h-[100px] md:h-[100px] bg-[#e5f6fd]"
        )}
      >
        <div className="flex gap-2 justify-between w-full">
          <Button
            size={"sm"}
            onClick={() => {
              setShowInstructions(false);
              setShowQuestionPaper(true);
            }}
            className="w-full h-auto py-2 text-xs bg-blue-300 font-normal text-dark"
          >
            Question Paper
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              setShowQuestionPaper(false);
              setShowInstructions(true);
            }}
            className="w-full h-auto py-2 text-xs bg-blue-300 font-normal text-dark"
          >
            Instructions
          </Button>
        </div>
        {examData.subject_time == "yes" ? (
          examData.submit_section_button == "yes" ? (
            <Button
              className="bg-green-600 hover:bg-green-800 uppercase shadow-md font-medium w-full"
              onClick={handleSubmitSection}
            >
              Submit section
            </Button>
          ) : (
            ""
          )
        ) : (
          <Button
            className="rounded-none uppercase shadow-md font-medium w-full bg-[#38a9eb]"
            onClick={showSubmitModalHandler}
          >
            Submit Exam
          </Button>
        )}
      </div>
    </>
  );
}

export default ExamDrawerContent;
