import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: {
      uid: null,
      username: null,
      fullname: null,
      email: null,
      social: null,
      lastlogin: null,
      createdat: null,
      updatedat: null
    },
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
    setSocial: (state, action) => {
      state.value.social = action.payload;
    },
    setLastLogin: (state, action) => {
      state.value.lastlogin = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.value.createdat = action.payload;
    },
    setUpdatedAt: (state, action) => {
      state.value.updatedat = action.payload;
    },
  },
});

export const getUId = (state) => state.userData.value.uid;
export const getUserName = (state) => state.userData.value.username;
export const getFullName = (state) => state.userData.value.fullname;
export const getEmail = (state) => state.userData.value.email;
export const getSocial = (state) => state.userData.value.social;
export const getLastLogin = (state) => state.userData.value.lastlogin;
export const getCreatedAt = (state) => state.userData.value.createdat;
export const getUpdatedAt = (state) => state.userData.value.updatedat;
export const {
  setUId,
  setUserName,
  setFullName,
  setEmail,
  setSocial,
  setLastLogin,
  setCreatedAt,
  setUpdatedAt,
} = userDataSlice.actions;

export default userDataSlice.reducer;
