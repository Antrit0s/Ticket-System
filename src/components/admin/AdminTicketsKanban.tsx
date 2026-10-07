import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { PriorityChip } from "../shared/ui/StatusBadges";
import type { Ticket } from "../../types";
import { relativeTime } from "../../lib/utils";
import { motion } from "framer-motion";
import { listContainer, listItem } from "../../lib/animations";

const COLUMNS: { key: Ticket["status"]; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

interface Props {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
  getUserName: (userId: string) => string;
  getCategoryName: (categoryId: string) => string;
  onStatusChange: (ticketId: string, newStatus: Ticket["status"]) => void;
}

export default function AdminTicketsKanban({
  tickets,
  onTicketClick,
  getUserName,
  getCategoryName,
  onStatusChange,
}: Props) {
  const theme = useTheme();
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [draggedOverCol, setDraggedOverCol] = useState<Ticket["status"] | null>(
    null,
  );

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    ticketId: string,
  ) => {
    event.dataTransfer.setData("text/plain", ticketId);
    event.dataTransfer.effectAllowed = "move";
    setDraggedTicketId(ticketId);
  };

  const handleDragEnd = () => {
    setDraggedTicketId(null);
    setDraggedOverCol(null);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    colKey: Ticket["status"],
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (draggedOverCol !== colKey) {
      setDraggedOverCol(colKey);
    }
  };

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>,
    colKey: Ticket["status"],
  ) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    if (draggedOverCol === colKey) {
      setDraggedOverCol(null);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: Ticket["status"],
  ) => {
    event.preventDefault();
    setDraggedOverCol(null);
    const ticketId =
      event.dataTransfer.getData("text/plain") || draggedTicketId;
    if (ticketId) {
      onStatusChange(ticketId, newStatus);
    }
    setDraggedTicketId(null);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      {COLUMNS.map((col) => {
        const colTickets = tickets.filter((t) => t.status === col.key);
        const colors = theme.palette.customStatus[col.key];
        const isOver = draggedOverCol === col.key;

        return (
          <Box
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={(e) => handleDragLeave(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
            sx={{
              bgcolor: isOver ? "action.selected" : "action.hover",
              borderRadius: 2,
              p: 1.5,
              minHeight: 320,
              transition: "background-color 0.2s ease, outline 0.2s ease",
              outline: isOver
                ? `2px dashed ${colors.fg}`
                : "2px dashed transparent",
              outlineOffset: -2,
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
                pb: 1,
                borderBottom: 2,
                borderColor: colors.fg,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {col.label}
              </Typography>
              <Chip
                size="small"
                label={colTickets.length}
                sx={{
                  fontWeight: 600,
                  bgcolor: colors.bg,
                  color: colors.fg,
                }}
              />
            </Stack>

            <motion.div
              variants={listContainer}
              initial="hidden"
              animate="show"
            >
              <Stack spacing={1.5}>
                {colTickets.length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4, display: "block" }}
                  >
                    Drop tickets here
                  </Typography>
                ) : (
                  colTickets.map((ticket) => {
                    const isDragging = draggedTicketId === ticket.id;

                    return (
                      <motion.div key={ticket.id} variants={listItem}>
                        <Card
                          draggable
                          onDragStart={(e) => handleDragStart(e, ticket.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onTicketClick(ticket.id)}
                          sx={{
                            cursor: "grab",
                            opacity: isDragging ? 0.45 : 1,
                            userSelect: "none",
                            transition:
                              "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                            "&:active": {
                              cursor: "grabbing",
                            },
                            "&:hover": {
                              transform: isDragging
                                ? "none"
                                : "translateY(-2px)",
                              boxShadow: 3,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, lineHeight: 1.3 }}
                              >
                                {ticket.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  flexShrink: 0,
                                  fontWeight: 500,
                                }}
                              >
                                #{ticket.id.slice(0, 6).toUpperCase()}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              {getCategoryName(ticket.categoryId)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 1 }}
                            >
                              by {getUserName(ticket.creatorId)}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PriorityChip priority={ticket.priority} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {relativeTime(ticket.createdAt)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </Stack>
            </motion.div>
          </Box>
        );
      })}
    </Box>
  );
}
