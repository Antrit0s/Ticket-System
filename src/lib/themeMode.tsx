import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider, type PaletteMode } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getTheme } from "../theme";

type ThemeMode = PaletteMode; // "light" | "dark"

interface ThemeModeValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeValue | undefined>(undefined);

// Key we use to remember the user's choice across reloads.
const STORAGE_KEY = "ticket-system-theme";

// First visit: follow the system preference. After that, follow the saved choice.
function getInitialMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Provides the current theme mode + a toggle, and applies the matching MUI theme.
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const value = useMemo(() => ({ mode, toggle }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={getTheme(mode)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used inside ThemeModeProvider");
  return ctx;
}
