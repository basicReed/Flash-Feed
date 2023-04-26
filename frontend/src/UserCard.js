import React, { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";
import { useNavigate } from "react-router-dom";
import FlashFeedApi from "./Api";

import "./UserCard.css";

const UserCard = ({
  userId,
  firstName,
  lastName,
  username,
  profileImage,
  followingCountUpdate,
}) => {
  const navigate = useNavigate();
  const activeUsername = localStorage.getItem("username");
  const [isFollowing, setIsFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // check if following
  useEffect(() => {
    async function getFollowData() {
      const checkIsFollowing = await FlashFeedApi.isFollowing(
        activeUsername,
        username
      );
      setIsFollowing(checkIsFollowing.isFollowing);
      setIsLoading(false);
    }

    getFollowData();
  }, []);

  // Click Toggle: Follow or Unfollow
  const handleFollowClick = async () => {
    setIsFollowing(!isFollowing);

    // toggleFollow.follow returns a boolean: follow=true
    const toggleFollow = await FlashFeedApi.toggleFollow(
      activeUsername,
      username
    );
    setIsFollowing(toggleFollow.follow);
    followingCountUpdate(toggleFollow.follow);
  };

  const handleUserButtonClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <>
      {/* Make sure Follow button is loaded */}
      {!isLoading && (
        <div className="user-card">
          <div className="user" onClick={handleUserButtonClick}>
            <div className="user-card-image">
              <ProfileImage imageUrl={profileImage} altText={username} />
            </div>
            <div className="user-info">
              <div className="username">
                <h2>
                  {firstName} {lastName}
                </h2>
              </div>
              <div className="user-username">
                <p> @{username}</p>
              </div>
            </div>
          </div>

          {activeUsername !== username && (
            <button className="follow-button" onClick={handleFollowClick}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default UserCard;
