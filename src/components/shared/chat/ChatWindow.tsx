import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
  useUpdateConversationPreviewMutation,
} from "../../../features/chat/chatApi";

interface Props {
  conversationId: string;
  userId: string;
  onBack: () => void;
}

export default function ChatWindow({ conversationId, userId, onBack }: Props) {
  const {
    data: messages = [],
    isLoading,
    isFetching,
  } = useGetMessagesQuery(conversationId, {
    pollingInterval: 3000,
  });
  const [sendMessage] = useSendMessageMutation();
  const [updatePreview] = useUpdateConversationPreviewMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mark the other person's messages as read.
  useEffect(() => {
    messages
      .filter((message) => message.senderId !== userId && !message.isRead)
      .forEach((message) => markAsRead(message.id));
  }, [messages, userId, markAsRead]);

  // Stay scrolled to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSend = async () => {
    const value = text.trim();
    if (!value) return;
    await sendMessage({ conversationId, senderId: userId, text: value });
    await updatePreview({ id: conversationId, lastMessage: value });
    setText("");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ display: { md: "none" } }}
        >
          Back
        </Button>
        <Typography variant="subtitle1">Chat</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          messages.map((message) => {
            console.log(
              "senderId:",
              message.senderId,
              "| userId:",
              userId,
              "| types:",
              typeof message.senderId,
              typeof userId,
            );
            const mine = String(message.senderId) === String(userId);
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: mine ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.isRead
                      ? mine
                        ? "chat.supportBg"
                        : "chat.customerBg"
                      : "grey.300",
                    color: message.isRead
                      ? mine
                        ? "chat.supportFg"
                        : "chat.customerFg"
                      : "grey.800",
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: mine ? "right" : "left",
                    mt: 0.25,
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />

        {/* Polling indicator: show when background fetch is happening */}
        {!isLoading && isFetching && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              justifyContent: "center",
              py: 1,
            }}
          >
            <CircularProgress size={12} />
            <Typography variant="caption" color="text.secondary">
              Updating...
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          size="small"
          fullWidth
          multiline
          placeholder="Type a message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <Button variant="contained" onClick={onSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
