import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePostLikes: (state, action) => {
      const { postId, isLiked, numLikes } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.postId === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].isLiked = isLiked;
        state.posts[postIndex].numLikes = numLikes;
      }
    },
  },
});

export const { setPosts, updatePostLikes } = postsSlice.actions;

export default postsSlice.reducer;
