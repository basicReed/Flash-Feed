import React, { useState, useEffect } from "react";
import Post from "./Post";
import FlashFeedApi from "./Api";

const Bookmarks = ({ user, showCommentPopup, onToggleCommentPopup }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const fetchedPosts = await FlashFeedApi.getUserBookmarks(user.userId);

      setPosts(fetchedPosts);
    }
    getPosts();
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.postId}
            user={user}
            {...post}
            showCommentPopup={showCommentPopup} // pass the state as a prop
            onToggleCommentPopup={onToggleCommentPopup}
          />
        ))
      ) : (
        <p>{`No post bookmarked...`}</p>
      )}
    </div>
  );
};

export default Bookmarks;
