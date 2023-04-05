import React, { useState, useEffect } from "react";
import FlashFeedApi from "./Api";
import UserCard from "./UserCard";
import Post from "./Post";

const ProfileContent = ({ activeTab, user, followingCountUpdate }) => {
  let content;
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    async function getTabData() {
      let tabData = [];

      switch (activeTab) {
        case "posts":
          tabData = await FlashFeedApi.getUserPost(user.userId);
          setPosts(tabData);
          break;
        case "following":
          tabData = await FlashFeedApi.getFollowed(user.userId);
          console.log("tab data: ", tabData);
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
    }
    getTabData();
  }, [activeTab]);

  switch (activeTab) {
    case "posts":
      content = (
        <div>
          {posts &&
            posts.map((post) => (
              <Post key={post.postId} user={user} {...post} />
            ))}
        </div>
      );
      break;
    case "following":
      content = (
        <div className="profile-content-follow">
          {following &&
            following.map((followed) => (
              <UserCard
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
          {followers &&
            followers.map((follows) => (
              <UserCard
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
