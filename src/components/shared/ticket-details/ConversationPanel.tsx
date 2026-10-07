import { useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { initials, relativeTime } from "../../../lib/utils";

type Filter = "all" | "support" | "customer";

interface Props {
  messages: {
    id: string;
    conversationId?: string;
    senderId: string;
    text: string;
    createdAt: string;
    attachment?: string;
  }[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  isFetchingMessages: boolean;
  users: { id: string; name: string; role?: string; department?: string }[];
}

export default function ConversationPanel({
  messages = [],
  filter = "all",
  onFilterChange,
  isFetchingMessages,
  users = [],
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const safeFilter: Filter =
    filter === "support" || filter === "customer" ? filter : "all";

  const isSupportUser = (userId: string) =>
    users.find((user) => user.id === userId)?.role === "admin";

  const visibleMessages = messages.filter((message) => {
    if (safeFilter === "support") return isSupportUser(message.senderId);
    if (safeFilter === "customer") return !isSupportUser(message.senderId);
    return true;
  });

  useEffect(() => {
    if (visibleMessages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [visibleMessages.length]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Typography variant="subtitle1">Conversation</Typography>
        <Select
          size="small"
          value={safeFilter}
          onChange={(event) => onFilterChange(event.target.value as Filter)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All replies</MenuItem>
          <MenuItem value="support">From support</MenuItem>
          <MenuItem value="customer">From customer</MenuItem>
        </Select>
      </Box>

      {isFetchingMessages && (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            py: 1,
            justifyContent: "center",
          }}
        >
          <CircularProgress size={12} />
          <Typography variant="caption" color="text.secondary">
            Updating...
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {visibleMessages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No replies yet.
          </Typography>
        ) : (
          visibleMessages.map((message) => {
            const sender = users.find((user) => user.id === message.senderId);
            const support = isSupportUser(message.senderId);
            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: support ? "row-reverse" : "row",
                  gap: 1.5,
                  maxWidth: "75%",
                  alignSelf: support ? "flex-end" : "flex-start",
                }}
              >
                <Avatar
                  sx={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}
                >
                  {sender ? initials(sender.name) : "?"}
                </Avatar>
                <Box
                  sx={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: support ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 0.5,
                      alignItems: "baseline",
                      flexDirection: support ? "row-reverse" : "row",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {sender?.name ?? "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {relativeTime(message.createdAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: support ? "chat.supportBg" : "chat.customerBg",
                      color: support ? "chat.supportFg" : "chat.customerFg",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    {message.attachment && (
                      <Link
                        component="button"
                        underline="hover"
                        sx={{ display: "block", mt: 1, fontSize: 12 }}
                      >
                        {message.attachment}
                      </Link>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Stack>
    </Box>
  );
}
