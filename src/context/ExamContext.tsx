// ExamContext.tsx
import { MTQStudentAnsArray } from "@/components/exams/questions/mtq";
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
  pques?: string;
  qques?: string;
  rques?: string;
  sques?: string;
  tques?: string;
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
  sentences?: Array<{ id: number; value: string }>;
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
  ans?:
    | string
    | null
    | MTQStudentAnsArray
    | Array<string>
    | Array<{ id: number; value: string }>
    | Array<string[]>
    | Array<any>
    | any;
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

export interface SubjectTimer {
  [key: string]: { _id: string; start_time: number; submitted: boolean };
}

export interface StudentExamState {
  start_date: number;
  subject_times?: SubjectTimer;
  activeSubject: number;
  activeQuestion: number;
  activeLang: keyof typeof ExamLanguage;
  student_answers: {
    [key: string]: Answer;
  };
  marked_for_review: Array<{ index: number; activeSubject: number }>;
  windowSwitch: number;
  showKeyboard: boolean;
  showCalculator: boolean;
}

export interface ObjectID {
  $oid: string;
}

export interface ExamAuthUser {
  firstname: string;
  lastname: string;
  webtesttoken: string;
  profile_pic: string;
  iat: number;
  institute_url: string;
  instiute_id: string;
  institute: { logo: string };
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
  max_score: number;
  test_name: string;
  qlimit: string;
  is_proctoring_allow: any;
  lang: ExamLanguage;
  available_languages: Array<keyof typeof ExamLanguage>;
  is_calc_allow: string;
  is_keyboard_allow: 0 | 1 | null;
  passage_alignment: string;
  qorder: string;
  plt_window: string;
  passage_with_qs: string;
  featured: string;
  testresume: number;
  browserswitchsubmittest: string;
  instructions: Instruction;
  subjects: Array<Subject>;
  subject_times?: SubjectTimer;
  subject_time: string;
  subject_lock: number;
  start_date?: number;
  remaining_time?: number;
  studentExamState: StudentExamState;
  audio_base_url: string;
}

type Action = {
  type:
    | "init"
    | "setActiveSubject"
    | "setActiveQuestion"
    | "start_exam"
    | "markAnswer"
    | "markVisited"
    | "markForReview"
    | "removeMarkForReview"
    | "setActiveLang"
    | "submit_section"
    | "submit_exam"
    | "showHideKeyboard"
    | "showHideCalculator"
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
  is_keyboard_allow: null,
  passage_alignment: "",
  qorder: "",
  plt_window: "",
  passage_with_qs: "",
  featured: "",
  testresume: 0,
  browserswitchsubmittest: "no",
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
    windowSwitch: 0,
    showKeyboard: true,
    showCalculator: true,
  },
  audio_base_url: "",
};

const startResumeSubjectTime = (state: ExamDetailData) => {
  const activeSubData = state.subjects[state.studentExamState.activeSubject];
  if (
    state.subject_time == "yes" &&
    state.studentExamState.subject_times &&
    !state.studentExamState.subject_times[activeSubData.sub_id]
  ) {
    state.studentExamState.subject_times[activeSubData.sub_id] = {
      _id: activeSubData.sub_id,
      start_time: Date.now(),
      submitted: false,
    };
    saveTest(state);
  }
};

const setActiveQuestion = async (
  state: ExamDetailData,
  questionIndex: number,
  subjectIndex: number,
  tt?: number
) => {
  if (tt) {
    saveQuestionTimeTaken(state, tt);
  }
  state.studentExamState.activeSubject = subjectIndex;
  state.studentExamState.activeQuestion = questionIndex;
  markVisitedQuestion(state, questionIndex, subjectIndex);
};

const saveQuestionTimeTaken = (state: ExamDetailData, sec: number) => {
  const vQs =
    state.subjects[state.studentExamState.activeSubject].questions[
      state.studentExamState.activeQuestion
    ];
  state.studentExamState.student_answers[vQs._id.$oid].tt =
    (state.studentExamState.student_answers[vQs._id.$oid].tt ?? 0) + sec;
};

const markVisitedQuestion = async (
  state: ExamDetailData,
  questionIndex: number,
  subjectIndex: number
) => {
  const vQs =
    state.subjects[state.studentExamState.activeSubject].questions[
      questionIndex
    ];
  if (!state.studentExamState.student_answers[vQs._id.$oid]) {
    state.studentExamState.student_answers[vQs._id.$oid] = {
      image: [],
      pdf: "",
      qid: vQs._id.$oid,
      qtype: vQs.question_type,
      sub_id: state.subjects[subjectIndex].sub_id,
      review: false,
      tt: 0,
    };
    await saveTest(state);
  }
};

// Create the reducer function
const examReducer = (state: ExamDetailData, action: Action): ExamDetailData => {
  // console.log("reducer action is called", action.type, action.payload);
  switch (action.type) {
    case "init":
      let newState = { ...state, ...action.payload } as ExamDetailData;
      newState.studentExamState.student_answers = action.payload.response ?? {};
      newState.studentExamState.subject_times =
        action.payload.subject_times ?? {};
      if (action.payload.start_date)
        newState.studentExamState.start_date = action.payload.start_date;
      startResumeSubjectTime(newState);
      if (newState.subject_time == "yes" && newState.subject_times) {
        const qsNotSubmitted = Object.values(newState.subject_times).filter(
          (s) => !s.submitted
        );
        if (qsNotSubmitted.length > 0) {
          setActiveQuestion(
            newState,
            0,
            newState.subjects.findIndex(
              (s) => s.sub_id == qsNotSubmitted[0]._id
            )
          );
        } else {
          // code...
        }
      } else {
        setActiveQuestion(newState, 0, 0);
      }

      return newState;
    case "start_exam":
      state.start_date = action.payload;
      state.studentExamState.start_date = action.payload;
      return { ...state };
    case "setActiveSubject":
      setActiveQuestion(state, 0, action.payload);
      return { ...state };
    case "setActiveQuestion":
      const visitedState = { ...state };
      console.log("action.payload.tt", action.payload.tt);

      setActiveQuestion(
        visitedState,
        action.payload.index,
        action.payload.subjectIndex,
        action.payload.tt ?? false
      );

      return visitedState;
    case "markAnswer":
      const d = { ...state };
      d.studentExamState.student_answers[action.payload.qid] = createAnswer(
        action.payload
      );
      saveTest(d);
      return d;
    case "deleteAnswer":
      delete state.studentExamState.student_answers[action.payload]["ans"];
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
    case "submit_section":
      if (
        !state.studentExamState.subject_times ||
        state.subject_time != "yes"
      ) {
        return state;
      }
      const submitSectionState = { ...state };
      const submitSectionSubjectData =
        submitSectionState.subjects[
          submitSectionState.studentExamState.activeSubject
        ];
      if (
        submitSectionState.studentExamState.subject_times &&
        submitSectionState.studentExamState.subject_times[
          submitSectionSubjectData.sub_id
        ]
      )
        submitSectionState.studentExamState.subject_times[
          submitSectionSubjectData.sub_id
        ].submitted = true;
      saveTest(submitSectionState, "No");
      if (
        submitSectionState.studentExamState.activeSubject <
        submitSectionState.subjects.length - 1
      ) {
        setActiveQuestion(
          submitSectionState,
          0,
          submitSectionState.studentExamState.activeSubject + 1
        );
      }

      startResumeSubjectTime(submitSectionState);

      return submitSectionState;
    case "submit_exam":
      const submitState = { ...state };
      saveTest(submitState, "Yes").then(() => {
        setTimeout(() => {
          if (typeof (window as any).Android != "undefined") {
            (window as any).Android.testCompletedCallback();
          } else {
            window.close();
          }
        }, 1500);
      });
      return submitState;
    case "showHideKeyboard":
      return {
        ...state,
        studentExamState: {
          ...state.studentExamState,
          showKeyboard: action.payload,
        },
      };
    case "showHideCalculator":
      return {
        ...state,
        studentExamState: {
          ...state.studentExamState,
          showKeyboard: action.payload,
        },
      };
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

function useApiCallReducer() {
  return useReducer(examReducer, initialState);
}

// Create a Provider component
const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useApiCallReducer();

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};

export { ExamContext, ExamProvider };
