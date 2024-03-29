import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import FlashFeedApi from "../Api";

function TopBar() {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const location = useLocation();
  // Get username for page
  const username = location.pathname.split("/")[2]; //Extract profile username (this component does not have access to params because its outside of the route being called)
  const activeUsername = localStorage.getItem("username");
  // Get current page
  const path = location.pathname;
  const title = path.split("/")[1];
  const upperTitle = title.charAt(0).toUpperCase() + title.slice(1);

  // "Follow Button" status check
  useEffect(() => {
    async function getFollowData() {
      if (title == "profile" && username !== activeUsername) {
        const checkIsFollowing = await FlashFeedApi.isFollowing(
          activeUsername,
          username
        );
        setIsFollowing(checkIsFollowing.isFollowing);
      }
    }
    getFollowData();
  }, [path, username]);

  // Follow Button toggle
  const handleFollowClick = async () => {
    setIsFollowing(!isFollowing);
    const toggleFollow = await FlashFeedApi.toggleFollow(
      activeUsername,
      username
    );
    setIsFollowing(toggleFollow.follow);
  };

  // Back button
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleGlobalClick = () => {
    navigate("/home");
  };

  const handleMyFeedClick = () => {
    navigate("/home/my-feed");
  };

  return (
    <div className="top-bar">
      {/* If !home show back button */}
      {title !== "home" && title !== "my-feed" && (
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
        </button>
      )}
      {/* if !profile show title : display username */}
      <h1 className="page-title">
        {title == "profile" ? `@${username}` : upperTitle}
      </h1>

      {title == "home" && (
        <div className="top-bar-buttons">
          <button
            className={`top-bar-button toggle-left ${
              path === "/home" ? "active" : ""
            }`}
            onClick={handleGlobalClick}
          >
            Global
          </button>
          <button
            className={`top-bar-button toggle-right ${
              path === "/home/my-feed" ? "active" : ""
            }`}
            onClick={handleMyFeedClick}
          >
            My Feed
          </button>
        </div>
      )}

      {/* if profile and !curUser display follow button */}
      {title == "profile" && username !== activeUsername && (
        <button className="follow-button" onClick={handleFollowClick}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}

export default TopBar;
