import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "isLogged",
  initialState: { value: false },
  reducers: {
    login: (state) => {
      state.value = true;
    },
    logout: (state) => {
      state.value = false;
    },
  },
});

export const getLoginStatus = (state) => state.isLogged.value;
export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
