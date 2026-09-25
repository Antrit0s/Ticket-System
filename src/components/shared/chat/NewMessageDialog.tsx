import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../../features/users/usersApi";
import { useCreateConversationMutation } from "../../../features/chat/chatApi";
import { getErrorMessage } from "../../../lib/errorMessage";

interface Props {
  open: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationSelected: (conversationId: string) => void;
  existingConversations: Array<{ id: string; participants: string[] }>;
}

// Dialog to start a new 1:1 conversation. If one already exists with the
// selected user, open it; otherwise create a new conversation.
export default function NewMessageDialog({
  open,
  onClose,
  currentUserId,
  onConversationSelected,
  existingConversations,
}: Props) {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createConversation, { isLoading: isCreating }] =
    useCreateConversationMutation();

  // Everyone except yourself, matching the search text.
  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUserId &&
      (!search || user.name.toLowerCase().includes(search.toLowerCase())),
  );

  const handleSelect = async (userId: string) => {
    // Reuse an existing 1:1 thread instead of duplicating it.
    const existing = existingConversations.find((conversation) =>
      conversation.participants.includes(currentUserId) && conversation.participants.includes(userId)
    );

    if (existing) {
      onConversationSelected(existing.id);
      onClose();
      return;
    }

    const result = await createConversation({
      participants: [currentUserId, userId],
    });

    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }

    toast.success("Conversation started");
    onConversationSelected(result.data!.id);
    onClose();
    setSearch("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Message</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            size="small"
            label="Search by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
            autoFocus
          />

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              No users found.
            </Typography>
          ) : (
            <List disablePadding sx={{ maxHeight: 300, overflow: "auto" }}>
              {filteredUsers.map((filteredUser) => (
                <ListItemButton
                  key={filteredUser.id}
                  onClick={() => handleSelect(filteredUser.id)}
                  disabled={isCreating}
                >
                  <ListItemText
                    primary={filteredUser.name}
                    secondary={filteredUser.department ?? filteredUser.email}
                  />
                </ListItemButton>
              ))}
            </List>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
