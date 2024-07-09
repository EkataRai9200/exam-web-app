import "@fontsource-variable/public-sans";
import React from "react";

import { router } from "@/routes/AppRoutes.ts";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// Importing global styles
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
