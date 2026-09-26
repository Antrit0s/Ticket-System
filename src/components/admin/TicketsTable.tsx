import {
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PriorityChip, StatusChip } from "../shared/StatusBadges";
import type { Ticket, User } from "../../types";

interface Props {
  tickets: Ticket[];
  users: User[];
  categories: { id: string; name: string }[];
  admins: User[];
  onTicketClick: (ticketId: string) => void;
  onAssign?: (ticketId: string, assigneeId: string) => void;
}

export default function TicketsTable({
  tickets,
  users,
  categories,
  admins,
  onTicketClick,
  onAssign,
}: Props) {
  const getUserNameById = (userId: string | null) =>
    userId ? (users.find((user) => user.id === userId)?.name ?? userId) : "—";
  const getCategoryNameById = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "General";

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Requester</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            {onAssign && <TableCell>Assignee</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} hover>
              <TableCell>
                <Link
                  component="button"
                  underline="hover"
                  onClick={() => onTicketClick(ticket.id)}
                  sx={{ fontWeight: 600 }}
                >
                  {ticket.title}
                </Link>
              </TableCell>
              <TableCell>{getUserNameById(ticket.creatorId)}</TableCell>
              <TableCell>{getCategoryNameById(ticket.categoryId)}</TableCell>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <StatusChip status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={ticket.priority} />
              </TableCell>
              {onAssign && (
                <TableCell>
                  <Select
                    size="small"
                    value={
                      ticket.assigneeId &&
                      admins.some((admin) => admin.id === ticket.assigneeId)
                        ? ticket.assigneeId
                        : ""
                    }
                    onChange={(event) =>
                      onAssign(ticket.id, event.target.value)
                    }
                    displayEmpty
                    sx={{ minWidth: 140 }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {admins.map((admin) => (
                      <MenuItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
