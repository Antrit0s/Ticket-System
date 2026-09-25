import { baseApi } from "../../lib/baseApi";
import type { Appointment } from "../../types";

export interface GetAppointmentsParams {
  userId?: string;
  technicianId?: string;
  ticketId?: string;
}

export interface CreateAppointmentBody {
  ticketId: string;
  technicianId: string;
  userId: string;
  scheduledAt: string;
  durationMinutes: number;
  location: string;
  notes?: string;
}

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], GetAppointmentsParams | void>({
      query: (params) => ({ url: "/appointments", params: params ?? undefined }),
      providesTags: [{ type: "Appointment", id: "LIST" }],
    }),

    createAppointment: builder.mutation<Appointment, CreateAppointmentBody>({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body: { ...body, status: "scheduled" },
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),

    // Cancel or complete an appointment.
    updateAppointment: builder.mutation<
      Appointment,
      { id: string; patch: Partial<Appointment> }
    >({
      query: ({ id: appointmentId, patch }) => ({
        url: `/appointments/${appointmentId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} = appointmentsApi;
