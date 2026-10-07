import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertType = "success" | "error" | "warning" | "info";

interface GlobalAlert {
  type: AlertType;
  title: string;
  message: string;
}

interface UiState {
  globalAlert: GlobalAlert | null;
}

const initialState: UiState = {
  globalAlert: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<GlobalAlert>
    ) => {
      state.globalAlert = action.payload;
    },

    hideAlert: (state) => {
      state.globalAlert = null;
    },
  },
});

export const {
  showAlert,
  hideAlert,
} = uiSlice.actions;

export default uiSlice.reducer;