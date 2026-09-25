import { baseApi } from "../../lib/baseApi";
import type { Conversation, Message } from "../../types";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/conversations",
      providesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    getMessages: builder.query<Message[], string>({
      query: (conversationId) =>
        `/messages?conversationId=${conversationId}&_sort=createdAt`,
      providesTags: [{ type: "Message", id: "LIST" }],
    }),

    sendMessage: builder.mutation<
      Message,
      { conversationId: string; senderId: string; text: string }
    >({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body: { ...body, createdAt: new Date().toISOString(), isRead: false },
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),

    updateConversationPreview: builder.mutation<
      Conversation,
      { id: string; lastMessage: string }
    >({
      query: ({ id: conversationId, lastMessage }) => ({
        url: `/conversations/${conversationId}`,
        method: "PATCH",
        body: { lastMessage, updatedAt: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    markAsRead: builder.mutation<Message, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "PATCH",
        body: { isRead: true },
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),

    createConversation: builder.mutation<
      Conversation,
      { participants: string[] }
    >({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body: { ...body, lastMessage: "", updatedAt: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateConversationPreviewMutation,
  useMarkAsReadMutation,
  useCreateConversationMutation,
} = chatApi;
