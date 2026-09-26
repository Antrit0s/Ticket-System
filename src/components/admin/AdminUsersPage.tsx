import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { useUpdateUserRoleMutation } from "../../features/auth/authApi";
import { getErrorMessage } from "../../lib/errorMessage";
import RoleChangeDialog from "./RoleChangeDialog";
import RoleChangeConfirmDialog from "./RoleChangeConfirmDialog";
import type { UserRole } from "../../types";

interface PendingChange {
  userId: string;
  userName: string;
  role: UserRole;
}

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const [selectOpen, setSelectOpen] = useState(false);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const handleRoleChange = async (
    userId: string,
    userName: string,
    newRole: UserRole,
  ) => {
    console.log("Sending role update:", { userId, newRole });
    const result = await updateUserRole({ userId, role: newRole });

    if (result.error) {
      console.error("Role update failed:", result.error);
      toast.error(getErrorMessage(result.error));
      return;
    }

    console.log("Role update succeeded for:", userName);
    toast.success(`${userName}'s role updated to ${newRole}`);
  };

  const confirmChange = async (role: UserRole) => {
    if (!pending) return;
    console.log("Confirm change triggered:", { ...pending, role });
    setIsChanging(true);
    await handleRoleChange(pending.userId, pending.userName, role);
    setIsChanging(false);
    setPending(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Typography variant="h1">Users & Roles</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectOpen(true)}
        >
          Change role
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.role === "admin" ? "Admin" : "User"}
                      color={user.role === "admin" ? "primary" : "default"}
                      variant={user.role === "admin" ? "filled" : "outlined"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RoleChangeDialog
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onProceed={(userId, userName, role) => {
          console.log("Moving from select step to confirm step:", {
            userId,
            userName,
            role,
          });
          setSelectOpen(false);
          setPending({ userId, userName, role });
        }}
      />
      <RoleChangeConfirmDialog
        open={pending !== null}
        userName={pending?.userName ?? ""}
        initialRole={pending?.role ?? "user"}
        isSubmitting={isChanging}
        onClose={() => setPending(null)}
        onConfirm={confirmChange}
      />
    </Box>
  );
}
