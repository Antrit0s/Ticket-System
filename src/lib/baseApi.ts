import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Ticket", "User", "Asset", "Appointment", "Conversation", "Message", "TicketMessage", "TicketActivity"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
