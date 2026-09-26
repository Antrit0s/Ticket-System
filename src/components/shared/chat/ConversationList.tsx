import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetConversationsQuery } from "../../../features/chat/chatApi";
import { useGetUsersQuery } from "../../../features/users/usersApi";
import NewMessageDialog from "./NewMessageDialog";

interface Props {
  userId: string;
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({ userId, selectedId, onSelect }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: conversations = [], isLoading } = useGetConversationsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const getUserName = (userId: string) => users.find((user) => user.id === userId)?.name ?? userId;
  const myConversations = conversations.filter((conversation) => conversation.participants.includes(userId));

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">Conversations</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          New
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List disablePadding>
          {myConversations.map((conversation) => {
            const peer = conversation.participants.find((participant) => participant !== userId) ?? conversation.participants[0];
            return (
              <ListItemButton
                key={conversation.id}
                selected={selectedId === conversation.id}
                onClick={() => onSelect(conversation.id)}
              >
                <ListItemText
                  primary={getUserName(peer)}
                  secondary={conversation.lastMessage}
                  slotProps={{ secondary: { noWrap: true } }}
                />
              </ListItemButton>
            );
          })}
        </List>
      )}

      <NewMessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currentUserId={userId}
        onConversationSelected={onSelect}
        existingConversations={conversations}
      />
    </Box>
  );
}
