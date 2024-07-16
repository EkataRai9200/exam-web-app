// ExamContext.tsx
import { toast } from "@/components/ui/use-toast";
import { saveTest } from "@/lib/utils";
import React, { Dispatch, createContext, useReducer } from "react";

export interface Instruction {
  _id: {
    $oid: string;
  };
  title: string;
  description: string;
}

export interface Question {
  _id: {
    $oid: string;
  };
  find_hint: string;
  marks_positive: string;
  marks_negative: string;
  question_type: string;
  font: string;
  question: string;
  hi_question?: string;
  language: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
  opt5?: string;
  slct_options?: Array<{ value: string } | undefined>;
  blanks?:
    | Array<{
        id: number;
        pre: string;
        post: string;
        char_count: number;
      }>
    | undefined;
  txt_inputs_count?: number;
  hi_opt1?: string;
  hi_opt2?: string;
  hi_opt3?: string;
  hi_opt4?: string;
  hi_opt5?: string;
  hi_slct_options?: Array<{ value: string } | undefined>;
  passage_desc: Array<PassageDesc>;
  hi_passage_desc: Array<any>;
  passage_id?: {
    $oid: string;
  };
  show_qs_passage?: boolean;
}

export interface PassageDesc {
  passage: string;
}

export interface Subject {
  sub_id: string;
  name: string;
  no_of_question: string;
  subject_time: string;
  qlimit: string;
  questions: Array<Question>;
}

export interface Answer {
  ans: string | null | Array<string>;
  image: Array<string>;
  pdf: string;
  qid: string;
  sub_id: string;
  qtype: string;
  tt: number;
  review?: boolean;
}

export enum ExamLanguage {
  EN = "English",
  HI = "Hindi",
}

// util func
export function createAnswer(obj: any): Answer {
  if (!obj.qid || !obj.qtype) {
    throw new Error("Invalid Answer Data");
  }

  return {
    ans: "",
    image: [],
    pdf: "",
    qid: "",
    qtype: "",
    sub_id: "",
    tt: 0,
    ...obj,
  };
}

export interface StudentExamState {
  start_date: number;
  activeSubject: number;
  activeQuestion: number;
  activeLang: keyof typeof ExamLanguage;
  student_answers: {
    [key: string]: Answer;
  };
  marked_for_review: Array<{ index: number; activeSubject: number }>;
}

export interface ObjectID {
  $oid: string;
}

export interface ExamAuthUser {
  firstname: string;
  lastname: string;
  webtesttoken: string;
  iat: number;
  institute_url: string;
  instiute_id: string;
  name: string;
  package_id: string;
  student_token: string;
  // sub: {};
  test_id: string;
  test_series_id: string;
  api_url: string;
  _id: ObjectID;
}

export interface ExamDetailData {
  _id: ObjectID;
  authUser?: ExamAuthUser;
  time_limit: string;
  test_time_limit: string;
  total_qs: string;
  subject_time: string;
  max_score: number;
  test_name: string;
  subject_lock: number;
  qlimit: string;
  is_proctoring_allow: any;
  lang: ExamLanguage;
  available_languages: Array<keyof typeof ExamLanguage>;
  is_calc_allow: string;
  is_keyboard_allow: any;
  passage_alignment: string;
  qorder: string;
  plt_window: string;
  passage_with_qs: string;
  featured: string;
  testresume: number;
  browserswitchsubmittest: string;
  instructions: Instruction;
  subjects: Array<Subject>;
  start_date?: number;
  remaining_time?: number;
  studentExamState: StudentExamState;
}

type Action = {
  type:
    | "init"
    | "setActiveSubject"
    | "setActiveQuestion"
    | "start_exam"
    | "markAnswer"
    | "markForReview"
    | "removeMarkForReview"
    | "setActiveLang"
    | "submit_exam"
    | "deleteAnswer";
  payload: any;
};

const initialState: ExamDetailData = {
  _id: {
    $oid: "",
  },
  time_limit: "",
  test_time_limit: "",
  total_qs: "",
  subject_time: "",
  max_score: 0,
  test_name: "",
  subject_lock: 0,
  qlimit: "",
  is_proctoring_allow: "",
  lang: ExamLanguage.EN,
  available_languages: [],
  is_calc_allow: "",
  is_keyboard_allow: "",
  passage_alignment: "",
  qorder: "",
  plt_window: "",
  passage_with_qs: "",
  featured: "",
  testresume: 0,
  browserswitchsubmittest: "",
  instructions: {
    _id: {
      $oid: "",
    },
    title: "",
    description: "",
  },
  subjects: [],
  studentExamState: {
    start_date: 0,
    activeSubject: 0,
    activeQuestion: 0,
    activeLang: "EN",
    student_answers: {},
    marked_for_review: [],
  },
};

// Create the reducer function
const examReducer = (state: ExamDetailData, action: Action): ExamDetailData => {
  // console.log("reducer action is called", action.type, action.payload);
  switch (action.type) {
    case "init":
      let newState = { ...state, ...action.payload };
      newState.studentExamState.student_answers = action.payload.response ?? {};
      if (action.payload.start_date)
        state.studentExamState.start_date = action.payload.start_date;
      return newState;
    case "start_exam":
      state.start_date = action.payload;
      state.studentExamState.start_date = action.payload;
      return { ...state };
    case "setActiveSubject":
      state.studentExamState.activeSubject = action.payload;
      state.studentExamState.activeQuestion = 0;
      return { ...state };
    case "setActiveQuestion":
      state.studentExamState.activeQuestion = action.payload;
      return { ...state };
    case "markAnswer":
      const d = { ...state };
      d.studentExamState.student_answers[action.payload.qid] = createAnswer(
        action.payload
      );
      saveTest(d);
      return d;
    case "deleteAnswer":
      delete state.studentExamState.student_answers[action.payload];
      saveTest(state);
      return { ...state };
    case "markForReview":
      const markedState = { ...state };
      const isMarked = state.studentExamState.marked_for_review.findIndex(
        (v) => v.index == action.payload.index
      );
      if (isMarked < 0)
        state.studentExamState.marked_for_review.push(action.payload);

      let markQs =
        markedState.subjects[action.payload.subjectIndex].questions[
          action.payload.index
        ];

      if (!markedState.studentExamState.student_answers[markQs._id.$oid])
        markedState.studentExamState.student_answers[markQs._id.$oid] = {
          ans: null,
          image: [],
          pdf: "",
          qid: markQs._id.$oid,
          qtype: markQs.question_type,
          sub_id: markedState.subjects[action.payload.subjectIndex].sub_id,
          tt: 0,
          review: true,
        };
      else {
        markedState.studentExamState.student_answers[markQs._id.$oid] = {
          ...markedState.studentExamState.student_answers[markQs._id.$oid],
          review: true,
        };
      }
      return markedState;
    case "removeMarkForReview":
      let removeMarkState = { ...state };
      const isMarkedAns = state.studentExamState.marked_for_review.findIndex(
        (v) => v.index == action.payload.index
      );
      if (isMarkedAns >= 0)
        state.studentExamState.marked_for_review.splice(isMarkedAns, 1);
      let removeMarkQs =
        removeMarkState.subjects[action.payload.subjectIndex].questions[
          action.payload.index
        ];
      removeMarkState.studentExamState.student_answers[
        removeMarkQs._id.$oid
      ].review = false;
      return removeMarkState;
    case "setActiveLang":
      const activeLangState = { ...state };
      activeLangState.studentExamState.activeLang = action.payload;
      return activeLangState;
    case "submit_exam":
      const submitState = { ...state };
      saveTest(submitState, "Yes").then(() => {
        toast({
          title: "Exam submitted successfully",
        });
        window.close();
      });
      return submitState;
    default:
      return state;
  }
};

// Create the Context
const ExamContext = createContext<{
  state: ExamDetailData;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

// Create a Provider component
const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};

export { ExamContext, ExamProvider };
