import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "isNewComment",
  initialState: { value: false },
  reducers: {
    toggleNewComment: (state) => {
      state.value = !state;
    },
  },
});

export const newCommentStatus = (state) => state.isNewComment.value;
export const { toggleNewComment } = commentSlice.actions;

export default commentSlice.reducer;
