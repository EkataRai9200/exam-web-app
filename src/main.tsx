import "@fontsource-variable/public-sans";
import React from "react";

import { router } from "@/routes/AppRoutes";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// Importing global styles
import "@/index.css";
import Loader from "@/components/blocks/Loader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<Loader visible={true} />}
    />
  </React.StrictMode>
);
