import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../features/appointments/appointmentsApi";
import { useGetTicketsQuery } from "../../features/tickets/ticketsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";
import AppointmentFormDialog from "./AppointmentFormDialog";
import { statusColor } from "../../lib/utils";

export default function AdminAppointmentsPage() {
  const [open, setOpen] = useState(false);
  const { data: appointments = [], isLoading } = useGetAppointmentsQuery();
  const { data: tickets = [] } = useGetTicketsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [updateAppointment] = useUpdateAppointmentMutation();

  const getUserName = (userId: string) => users.find((user) => user.id === userId)?.name ?? userId;
  const getTicketTitle = (ticketId: string) => tickets.find((ticket) => ticket.id === ticketId)?.title ?? ticketId;

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );

  const handleCancel = async (appointmentId: string) => {
    const result = await updateAppointment({ id: appointmentId, patch: { status: "cancelled" } });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Appointment cancelled");
  };

  const handleComplete = async (appointmentId: string) => {
    const result = await updateAppointment({ id: appointmentId, patch: { status: "completed" } });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Appointment marked as completed");
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
        }}
      >
        <Typography variant="h1">Appointments Schedule</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New appointment
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : sortedAppointments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No appointments yet.</Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {sortedAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    {new Date(appointment.scheduledAt).toLocaleString()}
                  </Typography>
                  <Chip
                    size="small"
                    label={appointment.status ?? "scheduled"}
                    color={statusColor(appointment.status)}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ticket: {getTicketTitle(appointment.ticketId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User: {getUserName(appointment.userId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Technician: {getUserName(appointment.technicianId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {appointment.location}
                </Typography>
                {appointment.notes && <Typography variant="caption">{appointment.notes}</Typography>}

                {(!appointment.status || appointment.status === "scheduled") && (
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => handleComplete(appointment.id)}
                    >
                      Mark Completed
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <AppointmentFormDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
