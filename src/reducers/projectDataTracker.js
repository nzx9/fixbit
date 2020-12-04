import { createSlice } from "@reduxjs/toolkit";

const projectDataSlice = createSlice({
  name: "projectData",
  initialState: {
    value: {
      pid: null,
      projectName: null,
      projectDescription: null,
      creatorId: null,
      adminId: null,
      dateCreated: null,
    },
  },
  reducers: {
    setPId: (state, action) => {
      state.value.pid = action.payload;
    },
    setProjectName: (state, action) => {
      state.value.projectName = action.payload;
    },
    setProjectDescription: (state, action) => {
      state.value.projectDescription = action.payload;
    },
    setCreatorId: (state, action) => {
      state.value.creatorId = action.payload;
    },
    setAdminId: (state, action) => {
      state.value.adminId = action.payload;
    },
    setDateCreated: (state, action) => {
      state.value.dateCreated = action.payload;
    },
  },
});

export const getPId = (state) => state.projectData.value.pid;
export const getProjectName = (state) => state.projectData.value.projectName;
export const getProjectDescription = (state) =>
  state.projectData.value.projectDescription;
export const getAdminId = (state) => state.projectData.value.adminId;
export const getCreatorId = (state) => state.projectData.value.creatorId;
export const getDateCreated = (state) => state.projectData.value.dateCreated;
export const {
  setPId,
  setProjectName,
  setProjectDescription,
  setCreatorId,
  setAdminId,
  setDateCreated,
} = projectDataSlice.actions;

export default projectDataSlice.reducer;
