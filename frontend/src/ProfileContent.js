import React, { useState, useEffect } from "react";
import FlashFeedApi from "./Api";
import UserCard from "./UserCard";
import LoadingIcon from "./LoadingIcon";
import Post from "./Post";

const ProfileContent = ({ activeTab, user, followingCountUpdate }) => {
  let content;
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check for tab each time activeTabe changes.
  // tab case will call data for current tab
  useEffect(() => {
    async function getTabData() {
      setIsLoading(true);
      let tabData = [];

      switch (activeTab) {
        case "posts":
          tabData = await FlashFeedApi.getUserPost(user.userId);
          setPosts(tabData);
          break;
        case "following":
          tabData = await FlashFeedApi.getFollowed(user.userId);
          setFollowing(tabData);
          break;
        case "followers":
          tabData = await FlashFeedApi.getFollowers(user.userId);
          setFollowers(tabData);
          break;
        case "likes":
          tabData = await FlashFeedApi.getLikedPost(user.userId);
          setLikes(tabData);
          break;
        default:
          break;
      }
      setIsLoading(false);
    }
    getTabData();
  }, [activeTab]);

  switch (activeTab) {
    case "posts":
      content = (
        <div>
          {isLoading && <LoadingIcon />}
          {posts && posts.map((post) => <Post key={post.postId} {...post} />)}
        </div>
      );
      break;
    case "following":
      content = (
        <div className="profile-content-follow">
          {isLoading && <LoadingIcon />}
          {following &&
            following.map((followed) => (
              <UserCard
                key={followed.userId}
                followingCountUpdate={followingCountUpdate}
                {...followed}
              />
            ))}
        </div>
      );
      break;
    case "followers":
      content = (
        <div className="profile-content-follow">
          {isLoading && <LoadingIcon />}
          {followers &&
            followers.map((follows) => (
              <UserCard
                key={follows.userId}
                followingCountUpdate={followingCountUpdate}
                {...follows}
              />
            ))}
        </div>
      );
      break;
    case "likes":
      content = (
        <div>
          {isLoading && <LoadingIcon />}
          {likes && likes.map((post) => <Post key={post.postId} {...post} />)}
        </div>
      );
      break;
    default:
      content = <div>Invalid tab selected.</div>;
  }

  return <div className="profile-content">{content}</div>;
};

export default ProfileContent;
