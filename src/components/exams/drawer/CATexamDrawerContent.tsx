import { useExamData } from "@/lib/hooks";

import Answered from "@/components/exams/cat_status/Answered";
import Marked from "@/components/exams/cat_status/Marked";
import MarkedAnswered from "@/components/exams/cat_status/MarkedAnswered";
import NotAnswered from "@/components/exams/cat_status/NotAnswered";
import NotVisited from "@/components/exams/cat_status/NotVisited";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Answer, ExamDetailData } from "@/context/ExamContext";
import { cn } from "@/lib/utils";
import { calcTotalQs } from "@/pages/submit/SubmitExam";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SubjectSubmitOverview from "../submit/SubjectSubmitOverview";

export const isAnswered = (a: Answer | undefined) => {
  return a && a.ans && a.ans.length > 0;
};
export const isMarkedReview = (a: Answer | undefined) => {
  return a && a.review;
};
export const isMarkedAndAnswered = (a: Answer | undefined) => {
  return a && isMarkedReview(a) && isAnswered(a);
};
export const isNotAnswered = (a: Answer | undefined) => {
  if (!a) return false;
  return !isAnswered(a) && !isMarkedReview(a) ? true : false;
};

function CATExamDrawerContent({
  setOpenDrawer,
}: {
  setShowQuestionPaper: any;
  setShowInstructions: any;
  setOpenDrawer?: any;
}) {
  const { examData, dispatch, submitExam } = useExamData();
  const [searchParams] = useSearchParams();
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

  return (
    <>
      {examData.authUser && (
        <div className="flex flex-row gap-2 justify-start md:h-[70px] items-center p-2 px-5">
          <Avatar className="w-12 h-12 mr-2">
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

      <div className="grid grid-cols-2 w-full overflow-hidden font-normal text-xs justify-between m-0 md:h-[130px]">
        <div className="flex gap-1 items-center">
          {/* <Badge className="min-w-5 justify-center px-1 bg-green-600 rounded-md">
            {
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isAnswered(a)
              ).length
            }
          </Badge> */}
          <Answered
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
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (v) => isMarkedReview(v) && !isAnswered(v)
              ).length
            }
          />
          Marked
        </div>

        <div className="flex gap-1 items-center">
          <NotVisited
            value={
              calcTotalQs(examData.subjects) -
              Object.values(examData.studentExamState.student_answers).length
            }
          />
          Not Visited
        </div>
        <div className="flex col-span-2 gap-2 items-center w-full overflow-hidden">
          <MarkedAnswered
            value={
              Object.values(examData.studentExamState.student_answers).filter(
                (a) => isMarkedAndAnswered(a)
              ).length
            }
          />
          Answered & Marked for Review (will also be evaluated)
        </div>
      </div>

      <div className="flex max-w-full overflow-x-auto gap-2 p-2 h-[32px] bg-[#4e85c5]">
        <h3 className="font-medium text-sm text-white">
          {examData.subjects[examData.studentExamState.activeSubject]?.name}
        </h3>
      </div>
      <p className="bg-[#e5f6fd] font-medium text-sm p-2">Choose a Question</p>
      <div className="bg-[#e5f6fd] pe-[30px] pb-0 grid grid-cols-4 auto-rows-max gap-x-0 gap-y-3 mb-0 h-[calc(100%-300px)] md:h-[calc(100%-410px)] overflow-y-auto">
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
                <NotVisited size="lg" value={qNo} />
              )}
              {sAns && notAnswered && <NotAnswered size="lg" value={qNo} />}
              {!isMarkedForReview && isAns && (
                <Answered size="lg" value={qNo} />
              )}
              {isMarkedForReview && !isAns && <Marked size="lg" value={qNo} />}
              {isMarkedForReview && isAns && (
                <MarkedAnswered size="lg" value={qNo} />
              )}
            </div>
          );
        })}
      </div>
      <div
        className={cn(
          "mt-auto flex flex-col justify-center items-center gap-2 p-4 py-0 border-t-2 border-blue-200 h-[100px] md:h-[100px] bg-[#e5f6fd]"
        )}
      >
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
            className="rounded-none uppercase shadow-md font-medium w-full bg-[#38aae9]"
            asChild
          >
            <Link to={{ pathname: "/submit", search: searchParams.toString() }}>
              Submit Exam
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}

export default CATExamDrawerContent;
