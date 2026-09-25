import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { useAppSelector } from "../../lib/hooks";
import type { User, UserRole } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onProceed: (userId: string, userName: string, role: UserRole) => void;
}

export default function RoleChangeDialog({ open, onClose, onProceed }: Props) {
  const currentUser = useAppSelector((state) => state.authSlice.user);
  const { data: users = [] } = useGetUsersQuery();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");

  // Reset everything whenever the dialog closes.
  useEffect(() => {
    if (!open) {
      console.log("RoleChangeDialog closed — resetting selection");
      setSelectedUser(null);
      setRole("user");
    }
  }, [open]);

  const searchableUsers = users.filter((user) => user.id !== currentUser?.id);

  
  const handleUserSelect = (user: User | null) => {
    console.log("User selected in RoleChangeDialog:", user?.id);
    setSelectedUser(user);
    setRole(user?.role ?? "user");
  };

  const handleProceed = () => {
    if (!selectedUser) return;
    console.log("Proceeding to confirm step:", {
      userId: selectedUser.id,
      role,
    });
    onProceed(selectedUser.id, selectedUser.name, role);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Change role</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Autocomplete
            options={searchableUsers}
            value={selectedUser}
            onChange={(_event, newValue) => handleUserSelect(newValue)}
            getOptionLabel={(user) => `${user.name} (${user.email})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Search user" size="small" />
            )}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 1.25, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedUser}
              onClick={handleProceed}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
