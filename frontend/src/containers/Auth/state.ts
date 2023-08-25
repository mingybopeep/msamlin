import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { axiosInstance } from "../../api";

export type AuthState = {
  email: string;
  id: number;
  loading: boolean;
  error: boolean;
};

export const initalState: AuthState = {
  email: "",
  id: 0,
  loading: false,
  error: false,
};

type AuthDetails = Pick<AuthState, "id" | "email">;

export const login = createAsyncThunk<
  AuthDetails,
  { email: string; password: string }
>("auth/login", async (payload) => {
  const path = `/login`;

  return (await axiosInstance.post(path, payload)).data;
});

export const register = createAsyncThunk<
  AuthDetails,
  { email: string; password: string }
>("auth/register", async (payload) => {
  const path = `/signup`;

  return (await axiosInstance.post(path, payload)).data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const path = `/logout`;

  await axiosInstance.get(path);
});

export const authSlice = createSlice({
  name: "auth",
  initialState: { ...initalState },
  reducers: {
    resetState: () => initalState,
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.id = 0;
      state.email = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = true;
      state.error = false;
      state.id = action.payload.id;
      state.email = action.payload.email;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    // register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.id = 0;
      state.email = "";
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = true;
      state.error = false;
      state.id = action.payload.id;
      state.email = action.payload.email;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });

    // logoout
    builder.addCase(logout.fulfilled, (state) => {
      state.id = 0;
      state.email = "";
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});
