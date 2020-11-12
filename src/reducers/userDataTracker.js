import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: { uid: null, firstname: null, lastname: null, email: null },
  },
  reducers: {
    setUId: (state, action) => {
      state.value.uid = action.payload;
    },
    setFirstName: (state, action) => {
      state.value.firstname = action.payload;
    },
    setLastName: (state, action) => {
      state.value.lastname = action.payload;
    },
    setEmail: (state, action) => {
      state.value.email = action.payload;
    },
  },
});

export const getUId = (state) => state.userData.value.uid;
export const getFirstName = (state) => state.userData.value.firstname;
export const getLastName = (state) => state.userData.value.lastname;
export const getEmail = (state) => state.userData.value.email;
export const {
  setUId,
  setFirstName,
  setLastName,
  setEmail,
} = userDataSlice.actions;

export default userDataSlice.reducer;
