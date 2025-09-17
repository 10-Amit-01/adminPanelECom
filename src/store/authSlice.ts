import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  user: { id: string; email: string } | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthState["user"] }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", state.accessToken);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
