// ExamContext.tsx
import {
  MTQStudentAnsArray,
  mapResponseAnswersToStudentAnsArray,
} from "@/components/exams/questions/mtq";
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
  is_random_order?: boolean;
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
  mcq_shuffled_order?: Array<number>;
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
  [key: string]: {
    _id: string;
    start_time?: number;
    elapsed_time?: number;
    submitted: boolean;
    timeSpent?: number;
  };
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
  timeSpent: number;
  startTimeLocal: number;
  activeAnswer: Answer["ans"];
  submitted: boolean;
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
  elapsed_time?: number;
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
  test_second_language: string;
  is_calc_allow: string;
  is_keyboard_allow: 0 | 1 | null;
  passage_alignment: string;
  qorder: string;
  plt_window: string;
  passage_with_qs: string;
  featured: string;
  testresume: number;
  browserswitchsubmittest: string;
  proctoring_allowed_browser_switches?: number;
  instructions: Instruction;
  subjects: Array<Subject>;
  subject_times?: SubjectTimer;
  subject_time: string;
  subject_lock: number;
  start_date?: number;
  test_end_date?: number;
  remaining_time?: number;
  studentExamState: StudentExamState;
  audio_base_url: string;
  submit_section_button: "yes" | "no";
}

type Action = {
  type:
    | "init"
    | "setActiveSubject"
    | "setActiveQuestion"
    | "start_exam"
    | "setActiveAnswer"
    | "markAnswer"
    | "markVisited"
    | "markForReview"
    | "removeMarkForReview"
    | "setActiveLang"
    | "submit_section"
    | "showHideKeyboard"
    | "showHideCalculator"
    | "deleteAnswer"
    | "notifySubmitted"
    | "updateTimer";
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
  test_second_language: "",
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
    timeSpent: 0,
    showKeyboard: true,
    showCalculator: false,
    startTimeLocal: 0,
    activeAnswer: "",
    submitted: false,
  },
  audio_base_url: "",
  submit_section_button: "yes",
};

const startResumeSubjectTime = (state: ExamDetailData) => {
  const activeSubData = state.subjects[state.studentExamState.activeSubject];

  if (
    state.subject_time == "yes" &&
    state.studentExamState.subject_times &&
    !state.studentExamState.subject_times[activeSubData.sub_id]
  ) {
    state.subjects.map((subject) => {
      if (
        state.studentExamState.subject_times &&
        !state.studentExamState.subject_times[subject.sub_id]
      )
        state.studentExamState.subject_times[subject.sub_id] = {
          _id: subject.sub_id,
          submitted: false,
        };
    });
  }
};

const setActiveQuestion = async (
  state: ExamDetailData,
  questionIndex: number,
  subjectIndex: number,
  markVisited: boolean = true
) => {
  // set active subject
  state.studentExamState.activeSubject = subjectIndex;

  // set active question
  state.studentExamState.activeQuestion = questionIndex;

  // mark visited
  if (markVisited) {
    markVisitedQuestion(state, questionIndex, subjectIndex);
  }

  // set active answer
  const question = state.subjects[subjectIndex].questions[questionIndex];
  const studentQuesResponse =
    state.studentExamState.student_answers[
      state.subjects[subjectIndex].questions[questionIndex]._id.$oid
    ];
  if (question.question_type == "SUBJECTIVE") {
    state.studentExamState.activeAnswer = {
      content: studentQuesResponse?.ans ?? "",
      subjectiveimages: studentQuesResponse?.image ?? [],
    };
  } else {
    state.studentExamState.activeAnswer = studentQuesResponse?.ans ?? "";
  }
};

const calcTimeSpent = (state: ExamDetailData) => {
  const timeSpent = Math.round(
    (Date.now() - state.studentExamState.startTimeLocal) / 1000
  );
  return timeSpent;
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

    if (
      vQs.is_random_order &&
      vQs.question_type == "MCQ" &&
      !state.studentExamState.student_answers[vQs._id.$oid].mcq_shuffled_order
    ) {
      state.studentExamState.student_answers[vQs._id.$oid].mcq_shuffled_order =
        [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
    }

    // await saveTest(state);
  }
};

const startResumeExamCallback = (state: ExamDetailData) => {
  if (state.subject_time == "yes" && state.studentExamState.subject_times) {
    const subjectsNotSubmitted = Object.values(
      state.studentExamState.subject_times
    ).filter((s) => !s.submitted);
    if (subjectsNotSubmitted.length > 0) {
      if (
        !state.studentExamState.subject_times[subjectsNotSubmitted[0]._id]
          .start_time
      ) {
        state.studentExamState.subject_times[
          subjectsNotSubmitted[0]._id
        ].start_time = Date.now();
      }
      setActiveQuestion(
        state,
        0,
        state.subjects.findIndex(
          (s) => s.sub_id == subjectsNotSubmitted[0]._id
        ),
        true
      );
    }
  } else {
    setActiveQuestion(state, 0, 0, true);
  }
};

const setInitialAnswers = (answers: any) => {
  if (!answers) return;
  Object.values(answers).map((q: any) => {
    if (q.qtype == "MTQ") {
      q.ans = mapResponseAnswersToStudentAnsArray(q.ans);
    }
    answers[q.qid] = q;
  });

  return answers;
};

// Create the reducer function
const examReducer = (state: ExamDetailData, action: Action): ExamDetailData => {
  // console.log("reducer action is called", action.type, action.payload);
  switch (action.type) {
    case "init":
      let newState = { ...state, ...action.payload } as ExamDetailData;
      newState.studentExamState.student_answers =
        setInitialAnswers(action.payload.response) ?? {};
      newState.studentExamState.subject_times =
        action.payload.subject_times ?? {};
      if (action.payload.start_date) {
        newState.studentExamState.start_date = action.payload.start_date;
        newState.studentExamState.startTimeLocal = Date.now();
      }
      startResumeSubjectTime(newState);
      startResumeExamCallback(newState);

      return newState;
    case "start_exam":
      state.start_date = state.studentExamState.start_date = action.payload;
      state.studentExamState.startTimeLocal = Date.now();
      if (state.subject_time == "yes" && state.studentExamState.subject_times) {
        const activeSubData =
          state.subjects[state.studentExamState.activeSubject];
        state.studentExamState.subject_times[activeSubData.sub_id] = {
          ...state.studentExamState.subject_times[activeSubData.sub_id],
          start_time: action.payload,
          timeSpent: 0,
          elapsed_time: 0,
        };
        saveTest(state);
      } else {
        startResumeExamCallback(state);
      }
      return { ...state };
    case "setActiveSubject":
      setActiveQuestion(state, 0, action.payload);
      return { ...state };
    case "setActiveQuestion":
      const visitedState = { ...state };

      setActiveQuestion(
        visitedState,
        action.payload.index,
        action.payload.subjectIndex,
        true
      );

      return visitedState;
    case "markAnswer":
      const d = { ...state };
      d.studentExamState.student_answers[action.payload.qid] = createAnswer(
        action.payload
      );
      d.studentExamState.timeSpent = calcTimeSpent(d);
      saveTest(d);
      return d;
    case "setActiveAnswer":
      const activeState = { ...state };
      activeState.studentExamState.activeAnswer = action.payload;

      return activeState;
    case "deleteAnswer":
      delete state.studentExamState.student_answers[action.payload]["ans"];
      state.studentExamState.activeAnswer = "";
      saveTest(state);
      return { ...state };
    case "markForReview":
      const markedState = { ...state };
      markedState.studentExamState.student_answers[action.payload.answer.qid] =
        createAnswer(action.payload.answer);
      markedState.studentExamState.student_answers[
        action.payload.answer.qid
      ].review = true;
      markedState.studentExamState.timeSpent = calcTimeSpent(markedState);
      saveTest(markedState);
      return markedState;

    case "removeMarkForReview":
      let removeMarkState = { ...state };
      let removeMarkQs =
        removeMarkState.subjects[action.payload.subjectIndex].questions[
          action.payload.index
        ];

      if (
        removeMarkState.studentExamState.student_answers[removeMarkQs._id.$oid]
      )
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
        submitSectionState.studentExamState.activeSubject += 1;
        const newSubData =
          submitSectionState.subjects[
            submitSectionState.studentExamState.activeSubject
          ];

        if (submitSectionState.studentExamState.subject_times) {
          submitSectionState.studentExamState.subject_times[
            newSubData.sub_id
          ].start_time = Date.now();
          submitSectionState.studentExamState.subject_times[
            newSubData.sub_id
          ].elapsed_time = 0;

          submitSectionState.studentExamState.startTimeLocal = Date.now();
        }
        setActiveQuestion(
          submitSectionState,
          0,
          submitSectionState.studentExamState.activeSubject
        );
      }

      return submitSectionState;
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
          showCalculator: action.payload,
        },
      };
    case "notifySubmitted":
      return {
        ...state,
        studentExamState: {
          ...state.studentExamState,
          submitted: true,
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
