import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { useUpdateAssetMutation } from "../../features/assets/assetsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";

interface Props {
  open: boolean;
  assetId: string | null;
  onClose: () => void;
}

// Dialog to assign an asset to a user (marks it "assigned").
export default function AssignAssetDialog({ open, assetId, onClose }: Props) {
  const { data: users = [] } = useGetUsersQuery();
  const [updateAsset] = useUpdateAssetMutation();
  const [selectedUserId, setSelectedUserId] = useState("");

  // Clear the selection whenever the dialog closes.
  useEffect(() => {
    if (!open) setSelectedUserId("");
  }, [open]);

  const handleAssign = async () => {
    if (!assetId || !selectedUserId) return;
    const result = await updateAsset({
      id: assetId,
      patch: {
        userId: selectedUserId,
        status: "assigned",
      },
    });

    if (result.error) {
      console.error("Assign asset error:", result.error);
      toast.error(getErrorMessage(result.error));
      return;
    }

    toast.success("Asset assigned successfully");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Assign Asset to User</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUserId}
              label="User"
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email}){user.role === "admin" ? " — Admin" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" disabled={!selectedUserId} onClick={handleAssign}>
              Assign
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
