interface Props {
  ticketAppointment?: Appointment;
  isLoading: boolean;
  role: string;
  users: { id: string; name: string; role?: string; department?: string }[];
  onEdit: (appointment: Appointment) => void;
  onCancel: () => void;
  onSchedule: () => void;
}

import { Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import { statusColor } from "../../../lib/utils";
import type { Appointment } from "../../../types";

export default function TicketAppointmentSection({
  ticketAppointment,
  isLoading,
  role,
  users,
  onEdit,
  onCancel,
  onSchedule,
}: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Appointment
      </Typography>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : ticketAppointment ? (
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "appointment.bg" }}>
          <Typography variant="body2">
            <strong>Date:</strong> {new Date(ticketAppointment.scheduledAt ?? "").toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Technician:</strong> {users.find((user) => user.id === ticketAppointment?.technicianId)?.name ?? ticketAppointment?.technicianId}
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {ticketAppointment?.location}
          </Typography>
          {ticketAppointment?.notes && (
            <Typography variant="body2">
              <strong>Notes:</strong> {ticketAppointment?.notes}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Status:</strong>
            <Chip
              size="small"
              label={ticketAppointment?.status ?? "scheduled"}
              color={statusColor(ticketAppointment?.status)}
            />
          </Typography>
          {role === "admin" &&
            (ticketAppointment?.status === "scheduled" || !ticketAppointment?.status) && (
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(ticketAppointment)}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={onCancel}>
                  Cancel Appointment
                </Button>
              </Box>
            )}
        </Box>
      ) : (
        <Box>
          {role === "admin" ? (
            <Button size="small" variant="outlined" onClick={onSchedule}>
              Schedule appointment
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No appointment scheduled yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
