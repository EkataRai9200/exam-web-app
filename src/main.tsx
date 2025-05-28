import "@fontsource-variable/public-sans";

import { router } from "@/routes/AppRoutes";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

// Importing global styles
import Loader from "@/features/loader/Loader";
import "@/index.css";
import { initGA } from "@/features/analytics/analytics";
import { ThemeProvider } from "./components/theme-provider";

// Add the meta tag dynamically for production
const metaTag = document.createElement("meta");
metaTag.httpEquiv = "Content-Security-Policy";
metaTag.content =
  "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval';";
document.head.appendChild(metaTag);

initGA();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="exam-theme" storageKey="vite-ui-theme">
    <RouterProvider
      router={router}
      fallbackElement={<Loader visible={true} />}
    />
  </ThemeProvider>
);
