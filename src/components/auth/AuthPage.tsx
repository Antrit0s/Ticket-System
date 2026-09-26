import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import RoleSelect from "./RoleSelect";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { brandWordmarkFont } from "../../theme";
import type { UserRole } from "../../types";

export default function AuthPage() {
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";
  const isForgotPassword = pathname === "/forgot-password";
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Brand panel (desktop only). */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          gap: 1.5,
          p: 8,
          bgcolor: "primary.main",
          color: "common.white",
        }}
      >
        <Typography
          sx={{
            fontFamily: brandWordmarkFont,
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          IT Service Desk
        </Typography>
        <Typography
          sx={{ color: "rgba(255,255,255,0.75)", fontSize: 14, maxWidth: 320 }}
        >
          Internal IT support ticketing platform for hardware, software, and
          access requests.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        {isSignup ? (
          <SignupForm />
        ) : isForgotPassword ? (
          <ForgotPasswordForm />
        ) : role === null ? (
          <RoleSelect onSelect={setRole} />
        ) : (
          <LoginForm role={role} onBack={() => setRole(null)} />
        )}
      </Box>
    </Box>
  );
}
