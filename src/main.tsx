import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import { store } from "./lib/store.ts";
import { ThemeModeProvider, useThemeMode } from "./lib/themeMode.tsx";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "react-toastify/dist/ReactToastify.css";

function Root() {
  const { mode } = useThemeMode();
  return (
    <BrowserRouter>
      <Provider store={store}>
        <CssBaseline />
        <App />
        <ToastContainer position="top-right" autoClose={3000} theme={mode} />
      </Provider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeModeProvider>
      <Root />
    </ThemeModeProvider>
  </StrictMode>,
);
