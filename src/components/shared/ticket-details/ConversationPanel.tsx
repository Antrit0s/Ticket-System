interface Props {
  messages: { id: string; conversationId?: string; senderId: string; text: string; createdAt: string; attachment?: string }[];
  filter: "all" | "support" | "customer";
  onFilterChange: (filter: "all" | "support" | "customer") => void;
  isFetchingMessages: boolean;
  users: { id: string; name: string; role?: string; department?: string }[];
}

import { Avatar, Box, Link, Select, Stack, Typography } from "@mui/material";
import { MenuItem, CircularProgress } from "@mui/material";
import { initials, relativeTime } from "../../../lib/utils";

export default function ConversationPanel({ messages, filter, onFilterChange, isFetchingMessages, users }: Props) {
  const isSupportUser = (userId: string) => users.find((user) => user.id === userId)?.role === "admin";
  const visibleMessages = messages.filter((message) => {
    if (filter === "support") return isSupportUser(message.senderId);
    if (filter === "customer") return !isSupportUser(message.senderId);
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, gap: 2 }}>
        <Typography variant="subtitle1">Conversation</Typography>
        <Select size="small" value={filter} onChange={(event) => onFilterChange(event.target.value as "all" | "support" | "customer")} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All replies</MenuItem>
          <MenuItem value="support">From support</MenuItem>
          <MenuItem value="customer">From customer</MenuItem>
        </Select>
      </Box>
      <Typography variant="caption" color="text.secondary">Timeline</Typography>
      {isFetchingMessages && (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", py: 1, justifyContent: "center" }}>
          <CircularProgress size={12} />
          <Typography variant="caption" color="text.secondary">Updating...</Typography>
        </Box>
      )}
      <Stack spacing={2.5} sx={{ mt: 2 }}>
        {visibleMessages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No replies yet.</Typography>
        ) : (
          visibleMessages.map((message) => {
            const sender = users.find((user) => user.id === message.senderId);
            const support = isSupportUser(message.senderId);
            return (
              <Box key={message.id} sx={{ display: "flex", gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>{sender ? initials(sender.name) : "?"}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{sender?.name ?? "Unknown"}</Typography>
                    <Typography variant="caption" color="text.secondary">{relativeTime(message.createdAt)}</Typography>
                  </Box>
                  <Box sx={{ mt: 0.5, p: 1.5, borderRadius: 2, bgcolor: support ? "chat.supportBg" : "chat.customerBg", color: support ? "chat.supportFg" : "chat.customerFg" }}>
                    <Typography variant="body2">{message.text}</Typography>
                    {message.attachment && (
                      <Link component="button" underline="hover" sx={{ display: "block", mt: 1, fontSize: 12 }}>
                        {message.attachment}
                      </Link>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Stack>
    </Box>
  );
}
