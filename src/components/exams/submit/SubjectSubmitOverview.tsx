
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ExamDetailData } from "@/context/ExamContext";

import {
    isAnswered,
    isMarkedReview,
} from "@/components/exams/drawer/examDrawerContent";

function SubjectSubmitOverview({ examData }: { examData: ExamDetailData }) {
  const subjectData =
    examData.subjects[examData.studentExamState.activeSubject];

  //   const subjectTimerData = examData.subject_times
  //     ? examData.subject_times[subjectData.sub_id]
  //     : null;
  const totalQs = subjectData ? subjectData.questions.length : 0;

  return (
    <>
      {subjectData ? (
        <Table className="border">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-start">
                Answered Questions
              </TableCell>
              <TableCell>
                <Badge className="bg-green-600">
                  {
                    Object.values(
                      examData.studentExamState.student_answers
                    ).filter(
                      (a) => a.sub_id == subjectData.sub_id && isAnswered(a)
                    ).length
                  }
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-start">
                UnAnswered Questions
              </TableCell>
              <TableCell>
                <Badge className="bg-red-600">
                  {
                    Object.values(
                      examData.studentExamState.student_answers
                    ).filter(
                      (a) => a.sub_id == subjectData.sub_id && !isAnswered(a)
                    ).length
                  }
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-start">
                Not Visited Questions
              </TableCell>
              <TableCell>
                <Badge className="bg-gray-300 text-black">
                  {totalQs -
                    Object.values(
                      examData.studentExamState.student_answers
                    ).filter((a) => a.sub_id == subjectData.sub_id).length}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-start">
                Marked for Review
              </TableCell>
              <TableCell>
                <Badge className="bg-purple-600">
                  {
                    Object.values(
                      examData.studentExamState.student_answers
                    ).filter(
                      (a) => a.sub_id == subjectData.sub_id && isMarkedReview(a)
                    ).length
                  }
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        "no subject data"
      )}
    </>
  );
}

export default SubjectSubmitOverview;
