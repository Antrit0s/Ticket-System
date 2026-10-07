import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ViewKanban, ViewList } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
  useGetTicketsQuery,
  useLogTicketActivityMutation,
  useUpdateTicketMutation,
} from "../../features/tickets/ticketsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import PaginationControls from "../shared/ui/PaginationControls.tsx";
import TicketsTable from "./TicketsTable.tsx";
import AdminTicketsKanban from "./AdminTicketsKanban.tsx";
import TableSkeleton from "../shared/ui/TableSkeleton.tsx";
import { getErrorMessage } from "../../lib/errorMessage.ts";
import type { Ticket } from "../../types/index.ts";
import KanbanSkeleton from "./KanbanSkeleton.tsx";

const PAGE_SIZE = 8;

export default function AdminTicketsQueue() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "kanban">("table");

  useEffect(() => setPage(1), [status, priority, search]);

  const { data: tickets = [], isLoading } = useGetTicketsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [updateTicket] = useUpdateTicketMutation();
  const [logActivity] = useLogTicketActivityMutation();

  const admins = users.filter((adminUser) => adminUser.role === "admin");

  // Newest first by default, then apply filters.
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

  // Reassign a ticket
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

  // Drag-and-drop status update
  const handleStatusChange = async (
    ticketId: string,
    newStatus: Ticket["status"],
  ) => {
    const currentTicket = tickets.find((t) => t.id === ticketId);
    if (!currentTicket || currentTicket.status === newStatus) return;

    const result = await updateTicket({
      id: ticketId,
      patch: { status: newStatus },
    });

    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }

    const formatStatus = (s: string) => s.replace("_", " ");
    await logActivity({
      ticketId,
      action: `Status changed from ${formatStatus(currentTicket.status)} to ${formatStatus(newStatus)} via Board`,
    });
    toast.success(`Ticket moved to ${formatStatus(newStatus)}`);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h1">Tickets Queue</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, newView) => newView && setView(newView)}
        >
          <ToggleButton value="table" sx={{ gap: 0.5 }}>
            <ViewList fontSize="small" />
            Table
          </ToggleButton>
          <ToggleButton value="kanban" sx={{ gap: 0.5 }}>
            <ViewKanban fontSize="small" />
            Board
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
        view === "table" ? (
          <TableSkeleton columns={7} rows={8} />
        ) : (
          <KanbanSkeleton />
        )
      ) : view === "table" ? (
        <TicketsTable
          tickets={paginatedTickets}
          users={users}
          categories={categories}
          admins={admins}
          onTicketClick={(ticketId) => navigate(`/admin/tickets/${ticketId}`)}
          onAssign={handleAssign}
        />
      ) : (
        <AdminTicketsKanban
          tickets={filtered}
          onTicketClick={(ticketId) => navigate(`/admin/tickets/${ticketId}`)}
          getUserName={(id) => users.find((u) => u.id === id)?.name ?? id}
          getCategoryName={(id) =>
            categories.find((c) => c.id === id)?.name ?? "General"
          }
          onStatusChange={handleStatusChange}
        />
      )}

      {view === "table" && (
        <PaginationControls
          total={filtered.length}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </Box>
  );
}
