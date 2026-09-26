import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  }),
  tagTypes: [
    "Ticket",
    "User",
    "Asset",
    "Appointment",
    "Conversation",
    "Message",
    "TicketMessage",
    "TicketActivity",
  ],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
