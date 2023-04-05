import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FlashFeedApi from "./Api";

function TopBar({ title }) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const { username } = useParams();
  const activeUsername = localStorage.getItem("username");

  // User Profile page check for follow button
  useEffect(() => {
    async function getFollowData() {
      if (title == "Profile" && username !== activeUsername) {
        console.log(username);
        console.log(activeUsername);
        const checkIsFollowing = await FlashFeedApi.isFollowing(
          activeUsername,
          username
        );
        console.log("check: ", checkIsFollowing.isFollowing);
        setIsFollowing(checkIsFollowing.isFollowing);
      }
    }
    getFollowData();
  }, [title, username]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFollowClick = async () => {
    setIsFollowing(!isFollowing);
    const toggleFollow = await FlashFeedApi.toggleFollow(
      activeUsername,
      username
    );
    console.log("toggle: ", toggleFollow.follow);
    setIsFollowing(toggleFollow.follow);
  };

  return (
    <div className="top-bar">
      {title !== "Home" && (
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
        </button>
      )}
      <h1 className="page-title">
        {title == "Profile" ? `@${username}` : title}
      </h1>
      {title == "Profile" && username !== activeUsername && (
        <button className="follow-button" onClick={handleFollowClick}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}

export default TopBar;
