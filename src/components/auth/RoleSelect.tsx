import { Box, Button, Card, Typography } from "@mui/material";
import type { UserRole } from "../../types";

interface Props {
  onSelect: (role: UserRole) => void;
}

export default function RoleSelect({ onSelect }: Props) {
  return (
    <Card sx={{ width: "100%", maxWidth: 420, p: 4 }}>
      <Typography variant="h1" gutterBottom>
        Sign in
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose how you want to sign in to continue.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => onSelect("user")}
        >
          Login as User
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => onSelect("admin")}
        >
          Login as Admin
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 3 }}
      >
        Admin access is managed by your IT administrator.
      </Typography>
    </Card>
  );
}
