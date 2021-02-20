import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "isNewComment",
  initialState: { value: false },
  reducers: {
    newComment: (state) => {
      state.value = true;
    },
    noNewComment: (state) => {
      state.value = false;
    },
  },
});

export const newCommentStatus = (state) => state.isNewComment.value;
export const { newComment, noNewComment } = commentSlice.actions;

export default commentSlice.reducer;
