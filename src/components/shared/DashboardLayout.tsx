import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { loggedOut } from "../../features/auth/authSlice";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { startUserTour } from "../../lib/userTour.ts";

const EXPANDED_WIDTH = 240;
const EXPANDED_WIDTH_MOBILE = 200;
const COLLAPSED_WIDTH = 72;

// App shell: role-based sidebar + top bar, with the active page in <Outlet />.
export default function DashboardLayout() {
  useEffect(() => {
    if (sessionStorage.getItem("justLoggedIn") === "true") {
      sessionStorage.removeItem("justLoggedIn");

      // Give the browser 150ms to finish rendering the layout and IDs
      setTimeout(() => {
        startUserTour();
      }, 150);
    }
  }, []);
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authSlice.user);

  if (!user) return null;

  const role = user.role ?? "user";
  const drawerWidth = !open
    ? COLLAPSED_WIDTH
    : isWide
      ? EXPANDED_WIDTH
      : EXPANDED_WIDTH_MOBILE;

  const handleLogout = () => {
    dispatch(loggedOut());
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopBar user={user} drawerWidth={drawerWidth} onLogout={handleLogout} />
      <Sidebar
        role={role}
        open={open}
        onToggle={() => setOpen((prev) => !prev)}
        currentPath={location.pathname}
        drawerWidth={drawerWidth}
      />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
