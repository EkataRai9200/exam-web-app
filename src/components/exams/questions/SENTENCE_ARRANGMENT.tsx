import { Question } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import React, { useEffect, useState } from "react";
import { QuestionTypeProps } from "./render";

interface RenderSENTENCE_ARRANGMENTOptionProps extends QuestionTypeProps {}

import { ReactSortable } from "react-sortablejs";

interface SortableItemType {
  id: number;
  name: string;
}

interface ItemType {
  id: number;
  value: string;
}

export function SENTENCE_ARRANGMENT({
  index,
  subjectIndex,
}: RenderSENTENCE_ARRANGMENTOptionProps) {
  const { examData, dispatch } = useExamData();

  const question: Question = examData.subjects[subjectIndex].questions[index];
  const activeLang = examData.studentExamState.activeLang;

  const studentResponse =
    examData.studentExamState.student_answers[question._id.$oid] ?? {};
  const ans: ItemType[] = (studentResponse?.ans as ItemType[]) ?? [];

  React.useEffect(() => {
    const sentences = question.sentences?.filter((v) => {
      return v.id != ans.filter((a) => a.id == v.id)[0]?.id;
    });
    setState(sentences?.map((s) => ({ id: s.id, name: s.value })) ?? []);
    setState2(ans?.map((s) => ({ id: s.id, name: s.value })) ?? []);
  }, [examData]);

  const markAnswer = (newState: SortableItemType[]) => {
    const ans: ItemType[] = [];
    newState.map((item) => {
      ans.push({ id: item.id, value: item.name });
    });
    const payload = {
      ...studentResponse,
      ans: ans,
      sub_id: examData.subjects[subjectIndex].sub_id,
      qid: question._id.$oid,
      qtype: question.question_type,
    };
    dispatch({
      type: "markAnswer",
      payload,
    });
  };

  const [state, setState] = useState<SortableItemType[]>([]);
  const [state2, setState2] = useState<SortableItemType[]>([]);
  useEffect(() => {
    if (
      examData.studentExamState.activeSubject == subjectIndex &&
      examData.studentExamState.activeQuestion == index
    ) {
      if (
        state2.length !=
        examData.studentExamState.student_answers[question._id.$oid]?.ans
          ?.length
      ) {
        markAnswer(state2);
      }
    }
  }, [state2]);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html:
            activeLang == "EN"
              ? question?.question
              : question?.hi_question ?? "",
        }}
      ></div>
      <div className="flex gap-2">
        <ReactSortable
          className="flex flex-col p-2 gap-2 h-[400px] w-full rounded-lg bg-gray-200"
          group={"shared"}
          list={state}
          setList={setState}
        >
          {state.map((item) => (
            <div
              className="rounded px-2 py-1 bg-gray-100"
              key={`sortable_${question._id.$oid}_${item.id}`}
            >
              {item.name}
            </div>
          ))}
        </ReactSortable>

        <ReactSortable
          className="flex flex-col p-2 gap-2 h-[400px] w-full rounded-lg bg-gray-200"
          group={"shared"}
          list={state2}
          onChoose={(e, s) => {
            console.log(e, s, state2);
            markAnswer(state2);
          }}
          setList={setState2}
        >
          {state2.map((item) => (
            <div
              className="rounded px-2 py-1 bg-green-100"
              key={`sortable_${question._id.$oid}_${item.id}_2`}
            >
              {item.name}
            </div>
          ))}
        </ReactSortable>
      </div>
    </>
  );
}
