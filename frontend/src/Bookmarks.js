import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./App";
import Post from "./Post";
import LoadingIcon from "./LoadingIcon";
import FlashFeedApi from "./Api";

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
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
              <Post key={post.postId} user={user} {...post} />
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
