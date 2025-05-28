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
  questionNumber?: number;
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
  image_answer?: "yes" | "no";
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
    submit_time?: number;
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
  submission_source?: SubmissionSource;
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

export type SubmissionSource = "timer" | "manual" | "proctor";

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
  is_option_based_marking: string;
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
    | "updateTimer"
    | "saveLatestState";
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
    startTimeLocal: Date.now(),
    activeAnswer: "",
    submitted: false,
  },
  audio_base_url: "",
  submit_section_button: "yes",
  is_option_based_marking: "",
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

export const calcTimeSpent = (state: ExamDetailData) => {
  const elapsedMs = Date.now() - state.studentExamState.startTimeLocal;
  const timeSpentSeconds = Math.ceil(elapsedMs / 1000);
  return timeSpentSeconds;
};

export const calcTimeSpentForTest = (state: ExamDetailData) => {
  const timeSpent = calcTimeSpent(state);

  const t = Math.round(
    Math.min(
      timeSpent,
      parseFloat(state.test_time_limit) * 60 - (state.elapsed_time ?? 0)
    )
  );
  return t;
};

export const calcTimeSpentForSubject = (
  state: ExamDetailData,
  sub_id: string
) => {
  const timeSpent = calcTimeSpent(state);

  if (state.subject_time == "no" || !state.studentExamState.subject_times) {
    return timeSpent;
  }

  const subject = state.subjects.find((s) => s.sub_id == sub_id);
  const maxDuration = subject?.subject_time ?? "0";
  const timeObj = state.studentExamState.subject_times[sub_id];

  return Math.round(
    Math.min(
      timeSpent,
      parseFloat(maxDuration) * 60 - (timeObj.elapsed_time ?? 0)
    )
  );
};

export const updateLatestTimeSpent = (state: ExamDetailData) => {
  const timeSpent = calcTimeSpentForTest(state);
  state.elapsed_time = Math.round(
    Math.min(
      (state.elapsed_time ?? 0) + timeSpent,
      parseFloat(state.time_limit) * 60
    )
  );

  (window as any).elapsed_time = state.elapsed_time;

  // save time spent on subject
  if (state.subject_time == "yes" && state.studentExamState.subject_times) {
    const sub_id = state.subjects[state.studentExamState.activeSubject].sub_id;
    const timeObj = state.studentExamState.subject_times[sub_id];

    if (!timeObj.elapsed_time) timeObj.elapsed_time = 0;
    timeObj.elapsed_time += calcTimeSpentForSubject(state, sub_id);
    timeObj.timeSpent = 0;
  }

  // save time spent on test
  state.studentExamState.timeSpent = timeSpent;
};

export const saveLatestTimeAndState = async (
  state: ExamDetailData,
  isSubmit?: boolean
) => {
  updateLatestTimeSpent(state);
  const res = await saveTest(state, isSubmit ? "Yes" : "No");
  resetTimeSpent(state);
  return res;
};

export const resetTimeSpent = (state: ExamDetailData) => {
  state.studentExamState.startTimeLocal = Date.now();
  state.studentExamState.timeSpent = 0;
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
  // check if test timer is subject wise or not
  if (state.subject_time == "yes" && state.studentExamState.subject_times) {
    // check if any subject is not submitted
    const subjectsNotSubmitted = Object.values(
      state.studentExamState.subject_times
    ).filter((s) => !s.submitted);

    // if any subject is not submitted, open that subject
    if (subjectsNotSubmitted.length > 0) {
      if (
        !state.studentExamState.subject_times[subjectsNotSubmitted[0]._id]
          .start_time
      ) {
        // if start time is not set, set it
        state.studentExamState.subject_times[
          subjectsNotSubmitted[0]._id
        ].start_time = Date.now();
      }

      // get subject index
      const subjectIndex = state.subjects.findIndex(
        (s) => s.sub_id == subjectsNotSubmitted[0]._id
      );

      // get all subject questions
      const subjectQs = Object.values(
        state.studentExamState.student_answers
      ).filter((item) => item.sub_id === subjectsNotSubmitted[0]._id);

      // get last active question of subject
      const lastActiveQs =
        subjectQs.length > 0 ? subjectQs[subjectQs.length - 1] : false;

      // get last question index
      const questionIndex = lastActiveQs
        ? state.subjects[subjectIndex].questions.findIndex(
            (item) => item._id["$oid"] === lastActiveQs.qid
          )
        : 0;

      // set active question
      setActiveQuestion(state, questionIndex, subjectIndex, true);
    }
  } else {
    if (
      state.studentExamState.start_date &&
      Object.keys(state.studentExamState.student_answers).length > 0
    ) {
      (window as any).elapsed_time = state.elapsed_time ?? 0;

      const lastActiveQs = Object.values(
        state.studentExamState.student_answers
      )[Object.keys(state.studentExamState.student_answers).length - 1];

      if (lastActiveQs.sub_id && lastActiveQs.qid) {
        const subjectIndex = state.subjects.findIndex(
          (item) => item.sub_id === lastActiveQs.sub_id
        );
        const questionIndex = state.subjects[subjectIndex].questions.findIndex(
          (item) => item._id["$oid"] === lastActiveQs.qid
        );
        setActiveQuestion(state, questionIndex, subjectIndex, true);
      } else {
        setActiveQuestion(state, 0, 0, true);
      }
    } else {
      setActiveQuestion(state, 0, 0, true);
    }
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
      newState.studentExamState.activeLang = newState.available_languages[0];
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
      saveLatestTimeAndState(d);
      return d;
    case "saveLatestState":
      const saveLatestState = { ...state };
      saveLatestTimeAndState(saveLatestState);
      return saveLatestState;
    case "setActiveAnswer":
      const activeState = { ...state };
      activeState.studentExamState.activeAnswer = action.payload;

      return activeState;
    case "deleteAnswer":
      delete state.studentExamState.student_answers[action.payload]["ans"];
      state.studentExamState.activeAnswer = "";
      saveLatestTimeAndState(state);
      return { ...state };
    case "markForReview":
      const markedState = { ...state };
      markedState.studentExamState.student_answers[action.payload.answer.qid] =
        createAnswer(action.payload.answer);
      markedState.studentExamState.student_answers[
        action.payload.answer.qid
      ].review = true;
      saveLatestTimeAndState(markedState);
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
      // check if subject time is enabled
      if (
        !state.studentExamState.subject_times ||
        state.subject_time != "yes"
      ) {
        return state;
      }

      // submitting the current section
      const submitSectionState = { ...state };
      const submitSectionSubjectData =
        submitSectionState.subjects[
          submitSectionState.studentExamState.activeSubject
        ];
      const currentSubTimeData = submitSectionState.studentExamState
        .subject_times
        ? submitSectionState.studentExamState.subject_times[
            submitSectionSubjectData.sub_id
          ]
        : null;
      if (
        submitSectionState.studentExamState.subject_times &&
        currentSubTimeData
      ) {
        currentSubTimeData.submitted = true;
        currentSubTimeData.submit_time = Date.now();
      }

      let activeSubIndex = submitSectionState.studentExamState.activeSubject;
      const isLastSubject =
        activeSubIndex == submitSectionState.subjects.length - 1;

      if (activeSubIndex < submitSectionState.subjects.length - 1) {
        saveLatestTimeAndState(submitSectionState);
      } else {
        saveLatestTimeAndState(submitSectionState, true);
        submitSectionState.studentExamState.submitted = true;
      }

      // navigating to next subject
      if (!isLastSubject) {
        activeSubIndex += 1;

        const newSubData = submitSectionState.subjects[activeSubIndex];

        if (submitSectionState.studentExamState.subject_times) {
          const activeSubTimeData =
            submitSectionState.studentExamState.subject_times[
              newSubData.sub_id
            ];
          if (!activeSubTimeData.start_time)
            activeSubTimeData.start_time = Date.now();

          if (!activeSubTimeData.elapsed_time)
            activeSubTimeData.elapsed_time = 0;

          // submitSectionState.studentExamState.startTimeLocal = Date.now();
        }

        submitSectionState.studentExamState.activeSubject = activeSubIndex;
        setActiveQuestion(submitSectionState, 0, activeSubIndex);
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
