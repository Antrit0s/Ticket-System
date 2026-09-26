import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authReducer } from "../features/auth/authSlice.ts";
import { baseApi } from "./baseApi.ts";

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer, authSlice: authReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
