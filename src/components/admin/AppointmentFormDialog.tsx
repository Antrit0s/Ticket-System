import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../../features/appointments/appointmentsApi";
import { useGetTicketsQuery } from "../../features/tickets/ticketsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";
import type { Appointment } from "../../types";

const schema = z.object({
  ticketId: z.string().min(1, "Pick a ticket"),
  technicianId: z.string().min(1, "Pick a technician"),
  scheduledAt: z.string().min(1, "Pick a date"),
  durationMinutes: z
    .string()
    .min(1, "Enter a duration")
    .refine((value) => Number(value) >= 15, "At least 15 minutes"),
  location: z.string().min(2, "Location is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  defaultTicketId?: string;
  initialAppointment?: Appointment | null;
}

// Dialog for admins to schedule or edit an appointment for a ticket.
export default function AppointmentFormDialog({
  open,
  onClose,
  defaultTicketId,
  initialAppointment,
}: Props) {
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const { data: tickets = [] } = useGetTicketsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const technicians = users.filter((user) => user.role === "admin");
  const bookableTickets = tickets.filter(
    (ticket) =>
      ticket.status === "open" ||
      ticket.status === "in_progress" ||
      ticket.id === defaultTicketId ||
      ticket.id === initialAppointment?.ticketId,
  );

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ticketId: defaultTicketId ?? "",
      technicianId: "",
      scheduledAt: "",
      durationMinutes: "30",
      location: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialAppointment) {
        // Convert ISO scheduledAt to a local datetime string (YYYY-MM-DDTHH:mm).
        const formattedDate = dayjs(initialAppointment.scheduledAt).format("YYYY-MM-DDTHH:mm");

        reset({
          ticketId: initialAppointment.ticketId,
          technicianId: initialAppointment.technicianId,
          scheduledAt: formattedDate,
          durationMinutes: String(initialAppointment.durationMinutes),
          location: initialAppointment.location,
          notes: initialAppointment.notes || "",
        });
      } else {
        reset({
          ticketId: defaultTicketId ?? "",
          technicianId: "",
          scheduledAt: "",
          durationMinutes: "30",
          location: "",
          notes: "",
        });
      }
    }
  }, [open, initialAppointment, defaultTicketId, reset]);

  const selectedTicket = tickets.find((ticket) => ticket.id === watch("ticketId"));

  const onSubmit = async (values: FormValues) => {
    if (!selectedTicket) return;

    if (initialAppointment) {
      const result = await updateAppointment({
        id: initialAppointment.id,
        patch: {
          ticketId: values.ticketId,
          technicianId: values.technicianId,
          scheduledAt: dayjs(values.scheduledAt, "YYYY-MM-DDTHH:mm").toISOString(),
          durationMinutes: Number(values.durationMinutes),
          location: values.location,
          notes: values.notes || undefined,
        },
      });
      if (result.error) {
        console.error("Update appointment error:", result.error);
        toast.error(getErrorMessage(result.error));
        return;
      }
      toast.success("Appointment updated");
    } else {
      const result = await createAppointment({
        ticketId: values.ticketId,
        technicianId: values.technicianId,
        userId: selectedTicket.creatorId,
        scheduledAt: dayjs(values.scheduledAt, "YYYY-MM-DDTHH:mm").toISOString(),
        durationMinutes: Number(values.durationMinutes),
        location: values.location,
        notes: values.notes || undefined,
      });
      if (result.error) {
        console.error("Create appointment error:", result.error);
        toast.error(getErrorMessage(result.error));
        return;
      }
      toast.success("Appointment scheduled");
    }

    reset();
    onClose();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialAppointment ? "Edit appointment" : "Schedule an appointment"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Controller
            name="ticketId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Ticket"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {bookableTickets.map((ticket) => (
                  <MenuItem key={ticket.id} value={ticket.id}>
                    {ticket.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="technicianId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Technician"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {technicians.map((technician) => (
                  <MenuItem key={technician.id} value={technician.id}>
                    {technician.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="scheduledAt"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker
                label="Date & time"
                value={field.value ? dayjs(field.value, "YYYY-MM-DDTHH:mm") : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.format("YYYY-MM-DDTHH:mm") : "")
                }
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="durationMinutes"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Duration (minutes)"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Location"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Notes" multiline rows={2} fullWidth />
            )}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {initialAppointment ? "Save changes" : "Schedule"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
