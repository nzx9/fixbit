import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: { uid: null, username: null, fullname: null, email: null },
  },
  reducers: {
    setUId: (state, action) => {
      state.value.uid = action.payload;
    },
    setUserName: (state, action) => {
      state.value.username = action.payload;
    },
    setFullName: (state, action) => {
      state.value.fullname = action.payload;
    },
    setEmail: (state, action) => {
      state.value.email = action.payload;
    },
  },
});

export const getUId = (state) => state.userData.value.uid;
export const getUserName = (state) => state.userData.value.username;
export const getFullName = (state) => state.userData.value.fullname;
export const getEmail = (state) => state.userData.value.email;
export const {
  setUId,
  setUserName,
  setFullName,
  setEmail,
} = userDataSlice.actions;

export default userDataSlice.reducer;
