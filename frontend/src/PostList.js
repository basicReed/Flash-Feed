import React from "react";
import Post from "./Post";

const PostList = ({ user, posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post
          user={user}
          isLiked={post.isLiked}
          isPrivate={post.isPrivate}
          postId={post.postId}
          key={post.postId}
          profileImgUrl={post.profileImgUrl}
          userId={post.userId}
          username={post.username}
          timestamp={post.datePosted}
          text={post.txtContent}
          imgUrl={post.imgUrl}
          numComments={post.numComments}
          likes={post.numLikes}
        />
      ))}
    </div>
  );
};

export default PostList;
