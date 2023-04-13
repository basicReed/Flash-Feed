import React, { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";
import "./Post.css";
import FlashFeedApi from "./Api";
import { timeSince } from "./helpers/timestamps";
import { useNavigate } from "react-router-dom";
import backupUserImg from "./backupUserImg.jpeg";

const Post = (props) => {
  const {
    user,
    postId,
    isLiked,
    isPrivate,
    profileImgUrl,
    username,
    timestamp,
    text,
    imgUrl,
    numComments,
    numLikes,
    isBookmarked,
  } = props;

  const navigate = useNavigate();

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(numLikes);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!profileImgUrl);
  }, [profileImgUrl]);

  const handleLike = async () => {
    try {
      // Update the state immediately
      setLiked(!liked);
      setLikeCount(
        liked ? parseInt(likeCount, 10) - 1 : parseInt(likeCount, 10) + 1
      );

      // Dispatch an action to update the post in the store
      const newIsLiked = !liked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

      //Make API Call
      const didLiked = await FlashFeedApi.likeOrUnlike(postId, user.userId);

      // Update the state again based on the result of the API call
      setLiked(didLiked);
      setLikeCount(parseInt(likeCount, 10) + (didLiked ? 1 : -1));
    } catch (err) {
      console.log("Error liking post:", err);
    }
  };

  const handleBookmark = async () => {
    try {
      // Update the state immediately
      setBookmarked(!bookmarked);
      // Make API call
      await FlashFeedApi.bookmarkOrRemove(user.userId, postId);
    } catch (err) {
      console.log("Error bookmarking post:", err);
    }
  };

  const handleUserButtonClick = () => {
    navigate(`/profile/${username}`);
  };

  const handleCommentButtonClick = () => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="post">
      <div className="post-header" onClick={handleUserButtonClick}>
        {isLoading ? (
          <ProfileImage key="backup" imageUrl={backupUserImg} />
        ) : (
          <ProfileImage key={profileImgUrl} imageUrl={profileImgUrl} />
        )}
        <div className="post-info">
          <h2>{username}</h2>
          <p>{timeSince(timestamp)}</p>
        </div>
      </div>
      <div className="post-body">
        <p>{text}</p>
        {imgUrl && <img src={imgUrl} alt="Post" />}
      </div>
      <div className="post-actions">
        <button onClick={handleCommentButtonClick}>
          <i className="far fa-comment"></i>
          {numComments}
        </button>
        <button onClick={handleBookmark}>
          {bookmarked ? (
            <i className="fas fa-bookmark" style={{ color: "#1da1f2" }}></i>
          ) : (
            <i className="far fa-bookmark"></i>
          )}
        </button>
        <button onClick={handleLike} className="post-like-btn">
          {liked ? (
            <>
              <i className="fas fa-heart" style={{ color: "red" }}></i>
              {likeCount}
            </>
          ) : (
            <>
              <i className="far fa-heart"></i>
              {likeCount}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Post;
