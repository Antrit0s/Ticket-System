import { Chip, useTheme } from "@mui/material";
import type { Ticket } from "../../types";

export function StatusChip({ status }: { status: Ticket["status"] }) {
  const theme = useTheme();
  const colors = theme.palette.customStatus[status] ?? {
    bg: theme.palette.action.disabledBackground,
    fg: theme.palette.text.secondary,
    label: "Unknown",
  };
  return (
    <Chip
      size="small"
      label={colors.label}
      sx={{ bgcolor: colors.bg, color: colors.fg, fontWeight: 600 }}
    />
  );
}

export function PriorityChip({ priority }: { priority: Ticket["priority"] }) {
  const theme = useTheme();
  const colors = theme.palette.customPriority[priority] ?? {
    bg: theme.palette.action.disabledBackground,
    fg: theme.palette.text.secondary,
    label: "Unknown",
  };
  return (
    <Chip
      size="small"
      label={colors.label}
      sx={{ bgcolor: colors.bg, color: colors.fg, fontWeight: 600 }}
    />
  );
}
