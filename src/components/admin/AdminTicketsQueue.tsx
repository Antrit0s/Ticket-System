import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  useGetCategoriesQuery,
  useGetTicketsQuery,
  useLogTicketActivityMutation,
  useUpdateTicketMutation,
} from "../../features/tickets/ticketsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import PaginationControls from "../shared/PaginationControls";
import TicketsTable from "./TicketsTable.tsx";

const PAGE_SIZE = 8;

// The full ticket queue for admins: search, sort, filter, and reassign.
export default function AdminTicketsQueue() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [status, priority, search]);

  const { data: tickets = [], isLoading } = useGetTicketsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [updateTicket] = useUpdateTicketMutation();
  const [logActivity] = useLogTicketActivityMutation();

  const admins = users.filter((adminUser) => adminUser.role === "admin");

  // Newest first by default, then apply status/priority/text filters.
  const filtered = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    const sorted = [...tickets].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (sortOrder === "oldest") sorted.reverse();
    return sorted.filter(
      (ticket) =>
        (!status || ticket.status === status) &&
        (!priority || ticket.priority === priority) &&
        (!searchQuery ||
          ticket.title.toLowerCase().includes(searchQuery) ||
          ticket.id.toLowerCase().includes(searchQuery)),
    );
  }, [tickets, status, priority, search, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedTickets = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Reassign a ticket and log the change to its activity timeline.
  const handleAssign = async (ticketId: string, assigneeId: string) => {
    const result = await updateTicket({
      id: ticketId,
      patch: { assigneeId: assigneeId || null },
    });
    if (assigneeId && !result.error) {
      const assignee = users.find((user) => user.id === assigneeId);
      const action = `Assigned to ${assignee?.name ?? assigneeId}`;
      await logActivity({ ticketId, action });
    }
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Tickets Queue
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          size="small"
          label="Search title or ID"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_progress">In progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(event) => setPriority(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
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
      ) : (
        <TicketsTable
          tickets={paginatedTickets}
          users={users}
          categories={categories}
          admins={admins}
          onTicketClick={(ticketId) => navigate(`/admin/tickets/${ticketId}`)}
          onAssign={handleAssign}
        />
      )}

      <PaginationControls
        total={filtered.length}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </Box>
  );
}
