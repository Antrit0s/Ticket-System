import { useState } from "react";
import { Box, Card, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "../../../lib/hooks";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const user = useAppSelector((state) => state.authSlice.user);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!user) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: { xs: "70vh", md: "calc(100vh - 112px)" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          display: !isDesktop && selectedId ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <ConversationList
          userId={user.id}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: isDesktop || selectedId ? "flex" : "none",
        }}
      >
        {selectedId ? (
          <ChatWindow
            conversationId={selectedId}
            userId={user.id}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <Card
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              Select a conversation
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
}
