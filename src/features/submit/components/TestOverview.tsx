import Answered from "@/components/status/Answered";
import Marked from "@/components/status/Marked";
import NotAnswered from "@/components/status/NotAnswered";
import NotVisited from "@/components/status/NotVisited";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useExamData } from "@/lib/hooks";
import { calcTotalQs } from "@/utils/examUtils";
import { isAnswered, isMarkedReview } from "@/utils/questionUtils";

export function TestOverview() {
  const { examData } = useExamData();

  const totalQs = calcTotalQs(examData.subjects);

  return (
    <div className="w-full bg-white">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Questions</TableCell>
            <TableCell>{totalQs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Answered Questions</TableCell>
            <TableCell>
              <Answered
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isAnswered(a)).length
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">UnAnswered Questions</TableCell>
            <TableCell>
              <NotAnswered
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => !isAnswered(a) && !isMarkedReview(a)).length
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Not Visited Questions</TableCell>
            <TableCell>
              <NotVisited
                value={
                  totalQs -
                  Object.values(examData.studentExamState.student_answers)
                    .length
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Marked for Review</TableCell>
            <TableCell>
              <Marked
                value={
                  Object.values(
                    examData.studentExamState.student_answers
                  ).filter((a) => isMarkedReview(a)).length
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
