import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/hooks";
import {
  useGetCategoriesQuery,
  useGetTicketsQuery,
} from "../../features/tickets/ticketsApi";
import { PriorityChip, StatusChip } from "../shared/StatusBadges";
import TicketForm from "./TicketForm";
export default function UserTicketsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authSlice.user);
  const {
    data: tickets = [],
    isLoading,
    isError,
  } = useGetTicketsQuery(user ? { creatorId: user.id } : undefined, {
    pollingInterval: 5000,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showForm, setShowForm] = useState(false);
  const visibleTickets = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    const sortedTickets = [...tickets].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (sortOrder === "oldest") sortedTickets.reverse();
    return sortedTickets.filter(
      (ticket) =>
        !searchQuery ||
        ticket.title.toLowerCase().includes(searchQuery) ||
        ticket.id.toLowerCase().includes(searchQuery),
    );
  }, [tickets, search, sortOrder]);

  if (!user) return null;

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Could not load your tickets. Please try again later.
        </Alert>
      </Box>
    );
  }

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "General";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: { xs: "stretch", md: "flex-start" },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ flex: 2, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h1">My Tickets</Typography>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            New ticket
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Search title or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={sortOrder}
              label="Date"
              onChange={(event) =>
                setSortOrder(event.target.value as "newest" | "oldest")
              }
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : visibleTickets.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No tickets yet. Create your first one.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2}>
            {visibleTickets.map((ticket) => (
              <Card
                key={ticket.id}
                onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {ticket.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getCategoryName(ticket.categoryId)}
                      </Typography>
                    </Box>
                    <StatusChip status={ticket.status} />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {ticket.description}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <PriorityChip priority={ticket.priority} />
                    <Typography variant="caption">
                      #{ticket.id.toUpperCase()} · Created{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      {showForm && (
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TicketForm
            onClose={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
          />
        </Box>
      )}
    </Box>
  );
}
