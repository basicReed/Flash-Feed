import React, { useState, useEffect } from "react";
import Post from "./Post";
import LoadingIcon from "./LoadingIcon";
import FlashFeedApi from "./Api";

const Bookmarks = ({ user, showCommentPopup, onToggleCommentPopup }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      const fetchedPosts = await FlashFeedApi.getUserBookmarks(user.userId);

      setPosts(fetchedPosts);
      setIsLoading(false);
    }
    getPosts();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <>
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
            <p>No post bookmarked...</p>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
