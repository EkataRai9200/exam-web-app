// Importing components for different routes
import { Dashboard } from "@/pages/Dashboard.tsx";
import Layout from "@/pages/Layout";
import { StartPage, StartPageLoaderData } from "@/pages/start/StartPage.tsx";
import SubmitExam from "@/pages/submit/SubmitExam";
import { TakeExam } from "@/pages/take/TakeExam.tsx";
// Importing createBrowserRouter function from react-router-dom
import { RouteObject, createBrowserRouter } from "react-router-dom";

// Defining routes configuration
export const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      {
        path: "/",
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
    ],
  },
];

// Creating a browser router with the defined routes
export const router = createBrowserRouter(routes, { basename: "/exam" });
