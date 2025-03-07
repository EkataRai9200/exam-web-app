// Importing components for different routes
import ErrorPage from "@/pages/ErrorPage";
import Layout from "@/pages/Layout";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import FeedbackPage from "@/pages/feedback/FeedbackPage";
import { StartPage, StartPageLoaderData } from "@/pages/start/StartPage.tsx";

// import {
//   StartPage as CATStartPage,
//   StartPageLoaderData as CATStartPageLoaderData,
// } from "@/pages/template/cat/start/StartPage";

import SubmitExam from "@/pages/submit/SubmitExam";
import { TakeExam } from "@/pages/take/TakeExam.tsx";
// Importing createBrowserRouter function from react-router-dom
import { RouteObject, createBrowserRouter } from "react-router-dom";

// Defining routes configuration
export const routes: RouteObject[] = [
  {
    // Component: Layout,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: TakeExam,
      },
      {
        path: "/cat-exam",
        children: [
          {
            path: "/cat-exam",
            lazy: async () => {
              const module = await import("@/pages/template/cat/take/TakeExam");
              return {
                Component: module.TakeExam,
              };
            },
          },
          {
            path: "/cat-exam/start",
            lazy: async () => {
              const module = await import(
                "@/pages/template/cat/start/StartPage"
              );
              return {
                Component: module.StartPage,
                loader: module.StartPageLoaderData,
              };
            },
          },
          {
            path: "/cat-exam/take",
            lazy: async () => {
              const module = await import("@/pages/template/cat/take/TakeExam");
              return {
                Component: module.TakeExam,
              };
            },
          },
          {
            path: "/cat-exam/submit",
            lazy: async () => {
              const module = await import(
                "@/pages/template/cat/submit/SubmitExam"
              );
              return {
                Component: module.SubmitExam,
              };
            },
          },
          {
            path: "/cat-exam/feedback",
            Component: FeedbackPage,
          },
        ],
        // Component: TakeExam,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/start",
        Component: StartPage,
        loader: StartPageLoaderData,
      },
      {
        path: "/take",
        Component: TakeExam,
      },
      {
        path: "/submit",
        Component: SubmitExam,
      },
      {
        path: "/feedback",
        Component: FeedbackPage,
      },
    ],
  },
];

// Creating a browser router with the defined routes
export const router = createBrowserRouter(routes);
