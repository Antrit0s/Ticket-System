import { baseApi } from "../../lib/baseApi";
import type { Ticket, TicketActivity, TicketMessage } from "../../types";

export interface GetTicketsParams {
  creatorId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
}

export interface CreateTicketBody {
  title: string;
  description: string;
  categoryId: string;
  priority: Ticket["priority"];
  assetId?: string | null;
  creatorId: string;
  attachment?: string;
}

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], GetTicketsParams | void>({
      query: (params) => ({ url: "/tickets", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((ticket) => ({
                type: "Ticket" as const,
                id: ticket.id,
              })),
              { type: "Ticket" as const, id: "LIST" },
            ]
          : [{ type: "Ticket" as const, id: "LIST" }],
    }),

    getCategories: builder.query<{ id: string; name: string }[], void>({
      query: () => "/categories",
    }),

    getTicket: builder.query<Ticket, string>({
      query: (ticketId) => `/tickets/${ticketId}`,
      providesTags: (_result, _error, ticketId) => [
        { type: "Ticket", id: ticketId },
      ],
    }),

    getTicketMessages: builder.query<TicketMessage[], string>({
      query: (ticketId) =>
        `/ticketMessages?ticketId=${ticketId}&_sort=createdAt`,
      providesTags: [{ type: "TicketMessage", id: "LIST" }],
    }),

    getTicketActivity: builder.query<TicketActivity[], string>({
      query: (ticketId) =>
        `/ticketActivity?ticketId=${ticketId}&_sort=createdAt`,
      providesTags: [{ type: "TicketActivity", id: "LIST" }],
    }),

    sendTicketMessage: builder.mutation<
      TicketMessage,
      { ticketId: string; senderId: string; text: string }
    >({
      query: (body) => ({
        url: "/ticketMessages",
        method: "POST",
        body: { ...body, createdAt: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "TicketMessage", id: "LIST" }],
    }),

    logTicketActivity: builder.mutation<
      TicketActivity,
      { ticketId: string; action: string }
    >({
      query: (body) => ({
        url: "/ticketActivity",
        method: "POST",
        body: { ...body, createdAt: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "TicketActivity", id: "LIST" }],
    }),

    createTicket: builder.mutation<Ticket, CreateTicketBody>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body: {
          ...body,
          status: "open",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    updateTicket: builder.mutation<
      Ticket,
      { id: string; patch: Partial<Ticket> }
    >({
      query: ({ id: ticketId, patch }) => ({
        url: `/tickets/${ticketId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id: ticketId }) => [
        { type: "Ticket", id: ticketId },
        { type: "Ticket", id: "LIST" },
        { type: "TicketMessage", id: "LIST" },
        { type: "TicketActivity", id: "LIST" },
      ],
    }),

    deleteTicket: builder.mutation<void, string>({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, ticketId) => [
        { type: "Ticket", id: ticketId },
        { type: "Ticket", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetCategoriesQuery,
  useGetTicketQuery,
  useGetTicketMessagesQuery,
  useGetTicketActivityQuery,
  useSendTicketMessageMutation,
  useLogTicketActivityMutation,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;
