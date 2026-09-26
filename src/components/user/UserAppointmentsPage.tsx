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
import { useAppSelector } from "../../lib/hooks";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../features/appointments/appointmentsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";
import { statusColor } from "../../lib/utils";

export default function UserAppointmentsPage() {
  const user = useAppSelector((state) => state.authSlice.user);
  const { data: appointments = [], isLoading } = useGetAppointmentsQuery(
    user ? { userId: user.id } : undefined,
  );
  const { data: users = [] } = useGetUsersQuery();
  const [updateAppointment] = useUpdateAppointmentMutation();

  if (!user) return null;

  const getUserName = (userId: string) =>
    users.find((user) => user.id === userId)?.name ?? userId;
  const sortedAppointments = appointments.toSorted(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );

  const handleCancel = async (appointmentId: string) => {
    const result = await updateAppointment({
      id: appointmentId,
      patch: { status: "cancelled" },
    });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Appointment cancelled");
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Appointments
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : sortedAppointments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No appointments scheduled.
          </Typography>
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  With {getUserName(appointment.technicianId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {appointment.location}
                </Typography>
                <Typography variant="caption">
                  Duration: {appointment.durationMinutes} min
                </Typography>
                {appointment.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {appointment.notes}
                  </Typography>
                )}
                {appointment.status === "scheduled" && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
