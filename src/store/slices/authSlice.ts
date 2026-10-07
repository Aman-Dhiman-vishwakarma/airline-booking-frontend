import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "../api/authApi";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<UserResponse>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    setAuthInitialized: (state) => { state.isInitialized = true; },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthInitialized,
} = authSlice.actions;

export default authSlice.reducer;