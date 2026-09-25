import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { useUpdateUserMutation } from "../../features/users/usersApi";
import { userUpdated } from "../../features/auth/authSlice";
import { getErrorMessage } from "../../lib/errorMessage";
import type { User } from "../../types";
import PasswordField from "./PasswordField";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  department: z.string(),
  password: z.string().refine((value) => value === "" || value.length >= 6, {
    message: "Password must be at least 6 characters",
  }),
});

type FormValues = z.infer<typeof schema>;

// Lets the logged-in user (or admin) edit their own profile: name, email,
// department, and optionally a new password.
export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authSlice.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      department: user?.department ?? "",
      password: "",
    },
  });

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    const patch: Partial<User> = {
      name: values.name,
      email: values.email,
      department: values.department,
    };
    // Only send a password when the user actually typed a new one.
    if (values.password) patch.password = values.password;

    const result = await updateUser({ id: user.id, patch });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    if (!result.data) return;
    dispatch(userUpdated(result.data));
    toast.success("Profile updated");
  };

  return (
    <Card sx={{ maxWidth: 640, p: 3 }}>
      <Typography variant="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {user.role === "admin" ? "Administrator" : "User"} account settings
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Full name"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
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
        <Controller
          name="department"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Department"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PasswordField
              {...field}
              label="New password"
              fullWidth
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message ?? "Leave blank to keep your current password"
              }
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Save changes"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
