interface Props {
  status: string;
  statusLabel: string;
  role: string;
  onChangeStatus: (newStatus: string) => void;
}

import { MenuItem, Select, TextField, Typography, Box } from "@mui/material";

export default function TicketStatusPanel({ status, statusLabel, role, onChangeStatus }: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Status
      </Typography>
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
    </Box>
  );
}
