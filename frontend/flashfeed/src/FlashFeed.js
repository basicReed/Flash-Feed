import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./App";
import PostForm from "./PostForm";
import Post from "./Post";
import LoadingIcon from "./LoadingIcon";
import InfiniteScroll from "react-infinite-scroll-component";

import FlashFeedApi from "./Api";

function FlashFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); //  variable for page number for post fetched
  const [hasMore, setHasMore] = useState(true); // variable to tell user if there is more posts available

  async function getPosts() {
    const fetchedPosts = await FlashFeedApi.getAllPost(user.userId, page);
    //Load more || stop
    fetchedPosts.length > 0
      ? setPosts((posts) => [...posts, ...fetchedPosts])
      : setHasMore(false);

    setPage(page + 1);
  }

  const addNewPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <InfiniteScroll
      dataLength={posts.length} //render the next data
      next={() => {
        getPosts();
      }}
      hasMore={hasMore}
      loader={<LoadingIcon />}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {/* Rendered Component */}
      <div className="Home">
        <div className="col">
          <div>
            <PostForm onPost={addNewPost} />
            {/* List of Posts */}
            {posts.map((post) => (
              <Post key={post.postId} user={user} {...post} />
            ))}
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
}

export default FlashFeed;
