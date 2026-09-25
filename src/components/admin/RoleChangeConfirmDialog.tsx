import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import type { UserRole } from "../../types";

interface Props {
  open: boolean;
  userName: string;
  initialRole: UserRole;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
}
export default function RoleChangeConfirmDialog({
  open,
  userName,
  initialRole,
  isSubmitting = false,
  onClose,
  onConfirm,
}: Props) {
  const [promote, setPromote] = useState(initialRole === "admin");

  useEffect(() => {
    if (open) {
      console.log(
        "RoleChangeConfirmDialog opened for:",
        userName,
        "initialRole:",
        initialRole,
      );
      setPromote(initialRole === "admin");
    }
  }, [open, initialRole, userName]);

  const handleConfirm = () => {
    const newRole: UserRole = promote ? "admin" : "user";
    console.log("Confirming role change for", userName, "->", newRole);
    onConfirm(newRole);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)" } },
        paper: {
          sx: {
            width: 340,
            maxWidth: "100%",
            borderRadius: 1.5, // 12px
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
            border: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{ fontSize: 16, fontWeight: 700, px: 2.75, pt: 2.75, pb: 1 }}
      >
        Role change
      </DialogTitle>
      <DialogContent sx={{ px: 2.75, pb: 2.75, pt: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            lineHeight: 1.5,
            mb: 1.75,
          }}
        >
          Are you sure you want to change the role for{" "}
          <strong>{userName}</strong>?
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={promote}
              onChange={(event) => setPromote(event.target.checked)}
            />
          }
          label="Promote to Admin"
          sx={{ mb: 2.25, fontSize: 14 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ height: 40, px: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={isSubmitting}
            sx={{ height: 40, px: 2 }}
          >
            {isSubmitting ? "Changing..." : "Change"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
