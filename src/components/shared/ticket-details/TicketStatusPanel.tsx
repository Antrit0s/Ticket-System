interface Props {
  status: string;
  statusLabel: string;
  role: string;
  onChangeStatus: (newStatus: string) => void;
}
import SectionCard from "./SectionCard";
import { MenuItem, Select, TextField } from "@mui/material";

export default function TicketStatusPanel({ status, statusLabel, role, onChangeStatus }: Props) {
  return (
    <SectionCard title="Ticket Status">
      
      {role === "admin" ? (
        <Select
          fullWidth
          size="small"
          value={status}
          onChange={(event) => onChangeStatus(event.target.value)}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in_progress">In progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
      ) : (
        <TextField
          fullWidth
          size="small"
          value={statusLabel}
          slotProps={{ htmlInput: { readOnly: true } }}
        />
      )}
    </SectionCard>
  );
}
