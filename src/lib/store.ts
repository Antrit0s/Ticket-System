import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi.ts";
import { authReducer } from "../features/auth/authSlice.ts";

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer, authSlice: authReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Refetch queries automatically when the window regains focus or reconnects.
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
