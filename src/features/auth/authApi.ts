import { baseApi } from "../../lib/baseApi.ts";
import { generateOtp } from "../../lib/email/generateOtp.ts";
import { sendOtpEmail } from "../../lib/email/sendEmail.ts";
import type {
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
  User,
  UserRole,
} from "../../types/index.ts";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<User, SignUpRequest>({
      async queryFn(userData, _api, _extra, baseQuery) {
        const result = await baseQuery("/users");
        if (result.error) return { error: result.error };
        const users = result.data as User[];

        const emailExists = users.some(
          (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
        );
        if (emailExists) {
          return {
            error: {
              status: 409,
              data: { message: "This email is already registered" },
            },
          };
        }

        const created = await baseQuery({
          url: "/users",
          method: "POST",
          body: {
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password,
            role: "user",
          },
        });
        if (created.error) return { error: created.error };

        return { data: created.data as User };
      },
      invalidatesTags: ["User"],
    }),
    sendLoginCode: builder.mutation<
      { user: User; emailSent: boolean },
      { email: string; role?: UserRole }
    >({
      async queryFn({ email, role }, _api, _extra, baseQuery) {
        const result = await baseQuery(
          `/users?email=${encodeURIComponent(email.toLowerCase())}`,
        );
        if (result.error) return { error: result.error };
        const users = result.data as User[];
        const user = users[0];

        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: "No account found with this email" },
            },
          };
        }

        // Don't send code unless Role match
        if (role && user.role !== role) {
          return {
            error: {
              status: 403,
              data: {
                message:
                  role === "admin"
                    ? "This account doesn't have admin access"
                    : "This is an admin account — use the admin login",
              },
            },
          };
        }

        const otp = generateOtp();
        const updated = await baseQuery({
          url: `/users/${user.id}`,
          method: "PATCH",
          body: { otp: otp },
        });
        if (updated.error) return { error: updated.error };

        // Fallback for Email.js
        const emailSent = await sendOtpEmail(user.email, otp);

        return { data: { user: updated.data as User, emailSent } };
      },
      invalidatesTags: ["User"],
    }),

    // Log in with a password or a one-time code.
    login: builder.mutation<{ user: User; token: string }, LoginRequest>({
      async queryFn({ email, password, otp, role }, _api, _extra, baseQuery) {
        const result = await baseQuery(
          `/users?email=${encodeURIComponent(email.toLowerCase())}`,
        );
        if (result.error) return { error: result.error };
        const users = result.data as User[];
        const user = users[0];

        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: "No account found with this email" },
            },
          };
        }

        if (password) {
          if (user.password !== password) {
            return {
              error: {
                status: 401,
                data: { message: "Wrong password" },
              },
            };
          }
        } else if (otp) {
          if (user.otp !== otp) {
            return {
              error: {
                status: 401,
                data: { message: "Wrong code" },
              },
            };
          }

          //clear OTP so it cannot be used after login
          await baseQuery({
            url: `/users/${user.id}`,
            method: "PATCH",
            body: { otp: null },
          });
        } else {
          return {
            error: {
              status: 400,
              data: { message: "Please enter your password or a code" },
            },
          };
        }

        // user role must match before login
        if (role && user.role !== role) {
          return {
            error: {
              status: 403,
              data: {
                message:
                  role === "admin"
                    ? "This account doesn't have admin access"
                    : "This is an admin account — use the admin login",
              },
            },
          };
        }

        const token = `token-${user.id}-${Date.now()}`;

        return { data: { user, token } };
      },
      invalidatesTags: ["User"],
    }),

    //
    forgotPassword: builder.mutation<
      { user: User; emailSent: boolean },
      { email: string }
    >({
      async queryFn({ email }, _api, _extra, baseQuery) {
        const result = await baseQuery(
          `/users?email=${encodeURIComponent(email.toLowerCase())}`,
        );
        if (result.error) return { error: result.error };
        const users = result.data as User[];
        const user = users[0];

        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: "No account found with this email" },
            },
          };
        }

        const otp = generateOtp();
        const updated = await baseQuery({
          url: `/users/${user.id}`,
          method: "PATCH",
          body: { otp: otp },
        });
        if (updated.error) return { error: updated.error };

        // Fallback for Email.js
        const emailSent = await sendOtpEmail(user.email, otp);

        return { data: { user: updated.data as User, emailSent } };
      },
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation<User, ResetPasswordRequest>({
      async queryFn({ email, otp, newPassword }, _api, _extra, baseQuery) {
        const result = await baseQuery(
          `/users?email=${encodeURIComponent(email.toLowerCase())}`,
        );
        if (result.error) return { error: result.error };
        const users = result.data as User[];
        const user = users[0];

        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: "No account found with this email" },
            },
          };
        }

        if (user.otp !== otp) {
          return {
            error: {
              status: 400,
              data: { message: "Wrong code. Please try again." },
            },
          };
        }

        // Clear the code so it can't be reused.
        const updated = await baseQuery({
          url: `/users/${user.id}`,
          method: "PATCH",
          body: { password: newPassword, otp: null },
        });
        if (updated.error) return { error: updated.error };

        return { data: updated.data as User };
      },
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation<User, { userId: string; role: UserRole }>({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSendLoginCodeMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserRoleMutation,
} = authApi;
