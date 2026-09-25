interface Props {
  asset?: { id: string; name: string; serialNumber: string; type: string; status: string };
  isLoading: boolean;
  role: string;
  onStatusChange: (newStatus: string) => void;
}

import { Box, CircularProgress, MenuItem, Select, TextField, Typography } from "@mui/material";

export default function TicketAssetSection({ asset, isLoading, role, onStatusChange }: Props) {
  if (!asset) return null;
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Related Asset
      </Typography>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
          <Typography variant="body2">
            <strong>Name:</strong> {asset.name}
          </Typography>
          <Typography variant="body2">
            <strong>Serial Number:</strong> {asset.serialNumber}
          </Typography>
          <Typography variant="body2">
            <strong>Type:</strong> {asset.type}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Status:</strong>
          </Typography>
          {role === "admin" ? (
            <Select
              fullWidth
              size="small"
              value={asset.status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
            </Select>
          ) : (
            <TextField fullWidth size="small" value={asset.status} slotProps={{ htmlInput: { readOnly: true } }} />
          )}
        </Box>
      )}
    </Box>
  );
}
