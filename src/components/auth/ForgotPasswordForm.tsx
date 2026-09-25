import { useState } from "react";
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
  Typography,
} from "@mui/material";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../features/auth/authApi";
import { getErrorMessage } from "../../lib/errorMessage";
import PasswordField from "../shared/PasswordField";

const emailSchema = z.object({ email: z.string().email("Enter a valid email") });

const resetSchema = z
  .object({
    code: z.string().min(6, "Enter the 6-digit code"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

// Step 1: enter email -> send one-time code.
// Step 2: enter code + new password twice -> reset.
export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

  const emailForm = useForm<{ email: string }>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onSendCode = async (values: { email: string }) => {
    const result = await forgotPassword({ email: values.email });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }

    setEmail(values.email);
    const { user, emailSent } = result.data;
    if (emailSent) {
      toast.success("Code sent to your email");
    } else {
      toast.info(`Email not configured yet. Your code is: ${user.otp}`);
    }
    setStep("reset");
  };

  const onReset = async (values: ResetValues) => {
    const result = await resetPassword({
      email,
      otp: values.code,
      newPassword: values.newPassword,
    });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Password reset! You can now sign in.");
    navigate("/");
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 420, p: 4 }}>
      <Typography variant="h1" gutterBottom>
        Forgot password
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {step === "email"
          ? "Enter your email and we'll send you a one-time code."
          : "Enter the code and choose a new password."}
      </Typography>

      {step === "email" ? (
        <Box
          component="form"
          onSubmit={emailForm.handleSubmit(onSendCode)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="email"
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" size="large" disabled={isSending}>
            {isSending ? <CircularProgress size={22} color="inherit" /> : "Send code"}
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={resetForm.handleSubmit(onReset)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="code"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="6-digit code"
                fullWidth
                slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 6 } }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <PasswordField
                {...field}
                label="New password"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={resetForm.control}
            render={({ field, fieldState }) => (
              <PasswordField
                {...field}
                label="Confirm new password"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" size="large" disabled={isResetting}>
            {isResetting ? <CircularProgress size={22} color="inherit" /> : "Reset password"}
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption">
          <Link component={RouterLink} to="/" underline="hover">
            Back to login
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}
