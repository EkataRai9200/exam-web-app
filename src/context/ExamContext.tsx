// ExamContext.tsx
import React, { createContext, useReducer, Dispatch } from "react";

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
  language: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
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
  ans: string;
  image: Array<string>;
  pdf: string;
  qid: string;
  qtype: string;
  tt: number;
}

export interface StudentExamState {
  start_date: number;
  activeSubject: number;
  activeQuestion: number;
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
  sub: {};
  test_id: string;
  test_series_id: string;
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
  lang: string;
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
  lang: "",
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
    student_answers: {},
    marked_for_review: [],
  },
};

// Create the reducer function
const examReducer = (state: ExamDetailData, action: Action): ExamDetailData => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "start_exam":
      state.studentExamState.start_date = action.payload;
      return { ...state };
    case "setActiveSubject":
      state.studentExamState.activeSubject = action.payload;
      return { ...state };
    case "setActiveQuestion":
      state.studentExamState.activeQuestion = action.payload;
      return { ...state };
    case "markAnswer":
      state.studentExamState.student_answers[action.payload.qid] =
        action.payload;
      return { ...state };
    case "deleteAnswer":
      delete state.studentExamState.student_answers[action.payload];
      return { ...state };
    case "markForReview":
      const isMarked = state.studentExamState.marked_for_review.findIndex(
        (v, i) => v.index == action.payload.index
      );
      if (isMarked < 0)
        state.studentExamState.marked_for_review.push(action.payload);
      return { ...state };
    case "removeMarkForReview":
      const isMarkedAns = state.studentExamState.marked_for_review.findIndex(
        (v, i) => v.index == action.payload.index
      );
      if (isMarkedAns >= 0)
        state.studentExamState.marked_for_review.splice(isMarkedAns, 1);
      return { ...state };
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
