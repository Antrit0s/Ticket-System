interface Props {
  ticket: Ticket;
  categoryName: string;
  assignee: User | undefined;
  isCreator: boolean;
  role: string;
  isUpdating: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onCloseStatus: () => void;
  onReopenStatus: () => void;
  onDeleteTicket: () => void;
}

import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import type { User, Ticket } from "../../../types";
import { StatusChip } from "../StatusBadges";

export default function TicketHeader({
  ticket,
  categoryName,
  assignee,
  isCreator,
  role,
  isUpdating,
  isDeleting,
  onBack,
  onCloseStatus,
  onReopenStatus,
  onDeleteTicket,
}: Props) {
  return (
    <Box>
      <IconButton onClick={onBack} size="small" sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Ticket Details
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: "primary.main", fontWeight: 700 }}
        >
          #TIC-{ticket.id.toUpperCase()}
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: 22, fontWeight: 700, mt: 0.5 }}
        >
          {ticket.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {ticket.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 1.5,
            alignItems: "center",
          }}
        >
          <Chip
            size="small"
            label={assignee ? "Administrator" : "Unassigned"}
          />
          <StatusChip status={ticket.status} />
          <Chip size="small" variant="outlined" label={categoryName} />
          {(isCreator || role === "admin") && ticket.status === "resolved" && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={isUpdating}
              onClick={onCloseStatus}
            >
              Close Ticket
            </Button>
          )}
          {isCreator &&
            (ticket.status === "resolved" || ticket.status === "closed") && (
              <Button
                size="small"
                variant="outlined"
                disabled={isUpdating}
                onClick={onReopenStatus}
              >
                Reopen Ticket
              </Button>
            )}
          {(isCreator || role === "admin") && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={isDeleting}
              onClick={onDeleteTicket}
            >
              Delete Ticket
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
