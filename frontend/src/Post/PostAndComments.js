import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import Post from "./Post";
import ProfileImage from "../Profile/ProfileImage";
import "./PostAndComments.css";
import FlashFeedApi from "../Api";
import LoadingIcon from "../Resources/LoadingIcon";

const PostAndComments = () => {
  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [numComments, setNumComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // GET post and comments
  useEffect(() => {
    async function getComments() {
      const fetchPost = await FlashFeedApi.getPost(postId, user.userId);
      setPost(fetchPost);

      const fetchedComments = await FlashFeedApi.getComments(postId);
      setComments(fetchedComments);
      setNumComments(fetchPost.numComments);

      setIsLoading(false);
    }
    getComments();
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Create new comment for post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = await FlashFeedApi.addComment(
      post.postId,
      user.userId,
      comment
    );

    setComments([...comments, newComment]);
    setComment("");
    setNumComments(parseInt(numComments) + 1);
  };

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="popup-background">
      <div className="comment-popup">
        <button className="close">&times;</button>

        <Post
          key={post.postId}
          user={user}
          {...post}
          numComments={numComments}
        />

        <div className="comment-section">
          <div className="comment-header">
            <p>{"@" + post.username}</p>
            <p>{numComments} Comments</p>
          </div>
          <div className="comments-list">
            {comments.map((c) => (
              <div className="comment" key={c.commentId}>
                <ProfileImage imageUrl={c.profileImgUrl} />
                <div className="content">
                  <p className="name">{c.username}</p>
                  <p>{c.txtContent}</p>
                  <p className="timestamp">
                    <ReactTimeAgo
                      date={Date.parse(c.dateCommented)}
                      locale="en-US"
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="footer">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
              />
              <button type="submit">Comment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAndComments;
