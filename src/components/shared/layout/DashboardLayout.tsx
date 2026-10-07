import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks.ts";
import { loggedOut } from "../../../features/auth/authSlice.ts";
import TopBar from "./TopBar.tsx";
import Sidebar from "./Sidebar.tsx";
import { pageTransition, pageVariants } from "../../../lib/animations.ts";

const EXPANDED_WIDTH = 240;
const EXPANDED_WIDTH_MOBILE = 200;
const COLLAPSED_WIDTH = 72;

export default function DashboardLayout() {
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
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 1 }}>
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
