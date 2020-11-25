import { createSlice } from "@reduxjs/toolkit";

const dataChangeSlice = createSlice({
  name: "isDataChanged",
  initialState: { value: false },
  reducers: {
    dataChanged: (state) => {
      state.value = true;
    },
    dataSet: (state) => {
      state.value = false;
    },
  },
});

export const getDataChangeStatus = (state) => state.isDataChanged.value;
export const { dataChanged, dataSet } = dataChangeSlice.actions;

export default dataChangeSlice.reducer;
