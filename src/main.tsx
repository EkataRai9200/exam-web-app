import "@fontsource-variable/public-sans";
import React from "react";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import "./index.css";
import { Dashboard } from "./pages/Dashboard.tsx";
import { StartPage } from "./pages/start/StartPage.tsx";
import { TakeExam } from "./pages/take/TakeExam.tsx";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/start",
      element: <StartPage />,
    },
    {
      path: "/take",
      element: <TakeExam />,
    },
  ],
  { basename: "/exam" }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
