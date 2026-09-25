import { baseApi } from "../../lib/baseApi";
import type { User } from "../../types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { role?: string } | void>({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, { id: string; patch: Partial<User> }>({
      query: ({ id: userId, patch }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id: userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation } = usersApi;
