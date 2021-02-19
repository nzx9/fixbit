import { createSlice } from "@reduxjs/toolkit";

const drawerOpenSlice = createSlice({
  name: "isDrawerOpen",
  initialState: { value: false },
  reducers: {
    drawerOpen: (state) => {
      state.value = true;
    },
    drawerClose: (state) => {
      state.value = false;
    },
  },
});

export const drawerOpenStatus = (state) => state.isDrawerOpen.value;
export const { drawerOpen, drawerClose } = drawerOpenSlice.actions;

export default drawerOpenSlice.reducer;
