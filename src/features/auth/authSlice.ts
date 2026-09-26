import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/index.ts";

export interface AuthState {
  user: User | null;
  token: string | null;
}

function getUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    loggedOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    userUpdated: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});
export const { loggedIn, loggedOut, userUpdated } = authSlice.actions;
export const authReducer = authSlice.reducer;
