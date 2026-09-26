import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Link,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  useLoginMutation,
  useSendLoginCodeMutation,
} from "../../features/auth/authApi";
import { loggedIn } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../lib/hooks";
import { getErrorMessage } from "../../lib/errorMessage";
import { getHomePath } from "../../lib/navSidebar";
import type { UserRole } from "../../types";
import OtpInput from "./OtpInput";
import PasswordField from "../shared/PasswordField";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().optional(),
  otp: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Method = "password" | "otp";

interface Props {
  role: UserRole;
  onBack: () => void;
}

export default function LoginForm({ role, onBack }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [sendCode, { isLoading: isSendingCode }] = useSendLoginCodeMutation();

  const [method, setMethod] = useState<Method>("password");
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining, 0 = ready

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", otp: "" },
  });

  const isAdmin = role === "admin";

  // Tick the resend countdown.
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSendCode = async () => {
    const email = getValues("email");
    if (!z.string().email().safeParse(email).success) {
      toast.error("Enter a valid email first");
      return;
    }

    const result = await sendCode({ email, role });

    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }

    const { user, emailSent } = result.data;
    if (emailSent) {
      toast.success("Code sent to your email");
    } else {
      toast.info(`Email not configured yet. Your code is: ${user.otp}`);
    }
    setCodeSent(true);
    setCooldown(60); //
  };

  const onSubmit = async (values: FormValues) => {
    if (method === "password") {
      if (!values.password) {
        toast.error("Password is required");
        return;
      }

      const result = await login({
        email: values.email,
        password: values.password,
        role,
      });
      if (result.error) {
        toast.error(getErrorMessage(result.error));
        return;
      }

      dispatch(loggedIn(result.data));
      toast.success(`Welcome back, ${result.data.user.name}`);
      sessionStorage.setItem("justLoggedIn", "true");
      navigate(getHomePath(result.data.user.role));
      return;
    }

    if (!codeSent) {
      toast.error("Send a code to your email first");
      return;
    }
    if (!values.otp || values.otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }

    const result = await login({ email: values.email, otp: values.otp, role });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }

    dispatch(loggedIn(result.data));
    toast.success(`Welcome back, ${result.data.user.name}`);
    navigate(getHomePath(result.data.user.role));
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 420, p: 4 }}>
      <Button
        onClick={onBack}
        size="small"
        startIcon={<ArrowBackIcon />}
        sx={{ minWidth: 0, px: 0, mb: 1, color: "text.secondary" }}
      >
        Back
      </Button>

      <Typography variant="h1" gutterBottom>
        {isAdmin ? "Admin login" : "User login"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {isAdmin
          ? "Sign in to the admin dashboard."
          : "Sign in to your account."}
      </Typography>

      <ToggleButtonGroup
        value={method}
        exclusive
        onChange={(_, value) => value && setMethod(value)}
        fullWidth
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="password">Password</ToggleButton>
        <ToggleButton value="otp">One-time code</ToggleButton>
      </ToggleButtonGroup>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {method === "password" ? (
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <PasswordField
                {...field}
                label="Password"
                autoComplete="current-password"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        ) : (
          <>
            <Button
              type="button"
              variant="outlined"
              onClick={handleSendCode}
              disabled={isSendingCode || cooldown > 0}
            >
              {isSendingCode ? (
                <CircularProgress size={22} color="inherit" />
              ) : codeSent ? (
                cooldown > 0 ? (
                  `Resend code (${cooldown}s)`
                ) : (
                  "Resend code"
                )
              ) : (
                "Send code"
              )}
            </Button>

            {codeSent && (
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <OtpInput
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Sign in"
          )}
        </Button>
      </Box>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          underline="hover"
          sx={{ fontSize: 12 }}
        >
          Forgot password?
        </Link>
      </Box>

      {!isAdmin && (
        <Box sx={{ mt: 1, textAlign: "center" }}>
          <Typography variant="caption">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      )}
    </Card>
  );
}
