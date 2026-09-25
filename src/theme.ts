import { createTheme, type PaletteMode } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    customStatus: {
      [key: string]: { bg: string; fg: string; label: string };
    };
    customPriority: {
      [key: string]: { bg: string; fg: string; label: string };
    };
    chat: {
      supportBg: string;
      supportFg: string;
      customerBg: string;
      customerFg: string;
    };
    appointment: { bg: string };
  }
  interface PaletteOptions {
    customStatus?: Palette["customStatus"];
    customPriority?: Palette["customPriority"];
    chat?: Palette["chat"];
    appointment?: Palette["appointment"];
  }
}

const BRAND_BLUE = "#1e4a8c";
const BRAND_BLUE_DARK = "#2f6bc4";

const typography = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  h1: { fontSize: 24, fontWeight: 700, lineHeight: 1.25 },
  h2: { fontSize: 20, fontWeight: 700 },
  h3: { fontSize: 16, fontWeight: 600 },
  subtitle1: { fontSize: 15, fontWeight: 600 },
  body1: { fontSize: 13, lineHeight: 1.5 },
  body2: { fontSize: 13 },
  caption: { fontSize: 12, color: "#6b7280" },
};

export const brandWordmarkFont = "'Georgia', serif";

export function getTheme(mode: PaletteMode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? BRAND_BLUE_DARK : BRAND_BLUE },
      background: {
        default: isDark ? "#12151b" : "#f3f4f6",
        paper: isDark ? "#1b1f27" : "#ffffff",
      },
      text: {
        primary: isDark ? "#e5e7eb" : "#1f2937",
        secondary: isDark ? "#9ca3af" : "#6b7280",
      },
      success: { main: "#16a34a" },
      info: { main: "#2563eb" },
      warning: { main: "#ea580c" },
      error: { main: "#dc2626" },
      divider: isDark ? "#262b36" : "#d1d5db",
      customStatus: {
        open: {
          bg: isDark ? "#3b2563" : "#f3e8ff",
          fg: isDark ? "#d8b4fe" : "#7c3aed",
          label: "Open",
        },
        in_progress: {
          bg: isDark ? "#1e3a8a" : "#dbeafe",
          fg: isDark ? "#93c5fd" : "#2563eb",
          label: "In progress",
        },
        resolved: {
          bg: isDark ? "#14532d" : "#dcfce7",
          fg: isDark ? "#86efac" : "#16a34a",
          label: "Resolved",
        },
        closed: {
          bg: isDark ? "#374151" : "#e5e7eb",
          fg: isDark ? "#d1d5db" : "#6b7280",
          label: "Closed",
        },
      },
      customPriority: {
        low: {
          bg: isDark ? "#14532d" : "#dcfce7",
          fg: isDark ? "#86efac" : "#16a34a",
          label: "Low",
        },
        medium: {
          bg: isDark ? "#7c2d12" : "#ffedd5",
          fg: isDark ? "#fdba74" : "#ea580c",
          label: "Medium",
        },
        high: {
          bg: isDark ? "#7f1d1d" : "#fee2e2",
          fg: isDark ? "#fca5a5" : "#dc2626",
          label: "High",
        },
        urgent: {
          bg: isDark ? "#450a0a" : "#fecaca",
          fg: isDark ? "#f87171" : "#991b1b",
          label: "Urgent",
        },
      },
      chat: {
        supportBg: isDark ? "#1e4a8c" : "#dbeafe",
        supportFg: isDark ? "#ffffff" : "#1f2937",
        customerBg: isDark ? "#262b36" : "#f3f4f6",
        customerFg: isDark ? "#e5e7eb" : "#1f2937",
      },
      appointment: {
        bg: isDark ? "#1b1f27" : "#f3f4f6",
      },
    },
    shape: { borderRadius: 8 },
    typography,
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            textTransform: "none",
            padding: "7px 16px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: `1px solid ${isDark ? "#262b36" : "#d1d5db"}`,
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "& .MuiOutlinedInput-notchedOutline": { borderWidth: 1.5 },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: isDark ? "#1b1f27" : "#f3f4f6",
            color: isDark ? "#9ca3af" : "#6b7280",
            fontWeight: 600,
            fontSize: 12,
          },
          root: {
            borderBottom: `1px solid ${isDark ? "#262b36" : "#d1d5db"}`,
            fontSize: 13,
          },
        },
      },
    },
  });
}
