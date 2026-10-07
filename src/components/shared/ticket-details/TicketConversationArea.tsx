import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { TicketActivity, TicketMessage, User } from "../../../types";
import ConversationPanel from "./ConversationPanel";
import ReplyBox from "./ReplyBox";
import ActivityTimeline from "./ActivityTimeline";

type TabValue = "conversation" | "activity";

interface Props {
  messages: TicketMessage[];
  activity: TicketActivity[];
  filter: "all" | "support" | "customer";
  reply: string;
  isFetchingMessages: boolean;
  isSending: boolean;
  users: User[];
  onFilterChange: (filter: "all" | "support" | "customer") => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
}

export default function TicketConversationArea({
  messages,
  activity,
  filter,
  reply,
  isFetchingMessages,
  isSending,
  users,
  onFilterChange,
  onReplyChange,
  onSendReply,
}: Props) {
  const [tab, setTab] = useState<TabValue>("conversation");

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Tabs
        value={tab}
        onChange={(_event, newValue: TabValue) => setTab(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider", minHeight: 40 }}
      >
        <Tab
          value="conversation"
          label="Conversation"
          sx={{ textTransform: "none", minHeight: 40, fontWeight: 600 }}
        />
        <Tab
          value="activity"
          label="Activity"
          sx={{ textTransform: "none", minHeight: 40, fontWeight: 600 }}
        />
      </Tabs>

      {tab === "conversation" ? (
        <Box
          sx={{
            height: "calc(100dvh - 320px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              pr: 1,
            }}
          >
            <ConversationPanel
              messages={messages}
              filter={filter}
              onFilterChange={onFilterChange}
              isFetchingMessages={isFetchingMessages}
              users={users}
            />
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <ReplyBox
              value={reply}
              onChange={onReplyChange}
              onSend={onSendReply}
              isSending={isSending}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: "calc(100dvh - 320px)",
            overflowY: "auto",
            pr: 1,
          }}
        >
          <ActivityTimeline activity={activity} />
        </Box>
      )}
    </Box>
  );
}
