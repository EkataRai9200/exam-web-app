import "@fontsource-variable/public-sans";
import React from "react";

import { router } from "@/routes/AppRoutes";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// Importing global styles
import "@/index.css";
import Loader from "@/components/blocks/Loader";
import { ThemeProvider } from "./components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="exam-theme" storageKey="vite-ui-theme">
      <RouterProvider
        router={router}
        fallbackElement={<Loader visible={true} />}
      />
    </ThemeProvider>
  </React.StrictMode>
);
