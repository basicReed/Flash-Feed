import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./App";
import NavBar from "./NavBar";
import PostForm from "./PostForm";
import PostList from "./PostList";
import Post from "./Post";
import SearchPanel from "./SearchPanel";
import CommentPopup from "./PostAndComments";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";
import LoadingIcon from "./LoadingIcon";
import InfiniteScroll from "react-infinite-scroll-component";

import FlashFeedApi from "./Api";

function FlashFeed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [curPost, setCurPost] = useState({});
  const [page, setPage] = useState(1); //  variable for page number
  const [hasMore, setHasMore] = useState(true); // variable to tell user if there is more

  console.log("FLashFeedUser: ", user);
  const refresh = (setPosts) => {};

  async function getPosts() {
    const fetchedPosts = await FlashFeedApi.getAllPost(user.userId, page);
    //Load more || stop
    fetchedPosts.length > 0
      ? setPosts((posts) => [...posts, ...fetchedPosts])
      : setHasMore(false);

    setPage(page + 1);
  }

  const addNewPost = (post) => {
    // getPosts();
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  // function to toggle the value of showCommentPopup
  const toggleCommentPopup = (post) => {
    setCurPost(post);
    setShowCommentPopup((prevValue) => !prevValue);
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <InfiniteScroll
      dataLength={posts.length} //This is important field to render the next data
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
      // below props only if you need pull down functionality
      refreshFunction={refresh}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}># 8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}># 8593; Release to refresh</h3>
      }
    >
      {/* Rndered Component */}
      <div className="Home">
        <div className="col">
          {/* If /flashfeed */}
          <div>
            {/* <h3>{`Welcome Back, ${user.firstName}!`}</h3> */}
            <PostForm onPost={addNewPost} />
            {/* List of Posts */}
            {posts.map((post) => (
              <Post key={post.postId} user={user} {...post} />
            ))}
          </div>
          {showCommentPopup && ( // render the CommentPopup outside the col2 div when showCommentPopup is true
            <CommentPopup
              user={user}
              post={curPost}
              onClose={toggleCommentPopup}
            />
          )}
        </div>
      </div>
    </InfiniteScroll>
  );
}

export default FlashFeed;
