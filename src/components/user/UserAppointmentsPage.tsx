import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAppSelector } from "../../lib/hooks";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../features/appointments/appointmentsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";
import { statusColor } from "../../lib/utils";
import { listContainer, listItem } from "../../lib/animations";
import CardListSkeleton from "../shared/ui/CardListSkeleton.tsx";

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
        <CardListSkeleton count={3} />
      ) : sortedAppointments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No appointments scheduled.
          </Typography>
        </Card>
      ) : (
        <motion.div variants={listContainer} initial="hidden" animate="show">
          <Stack spacing={2}>
            {sortedAppointments.map((appointment) => (
              <motion.div key={appointment.id} variants={listItem}>
                <Card>
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
                    {appointment.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {appointment.notes}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="caption">
                        Duration: {appointment.durationMinutes} min
                      </Typography>
                      {appointment.status === "scheduled" && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel Appointment
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </motion.div>
      )}
    </Box>
  );
}
