import React from "react";
import "./ProfileNavigation.css";

const ProfileNavigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="profile-nav">
      <ul>
        <li
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => onTabChange("posts")}
        >
          Posts
        </li>
        <li
          className={activeTab === "following" ? "active" : ""}
          onClick={() => onTabChange("following")}
        >
          Following
        </li>
        <li
          className={activeTab === "followers" ? "active" : ""}
          onClick={() => onTabChange("followers")}
        >
          Followers
        </li>
        <li
          className={activeTab === "likes" ? "active" : ""}
          onClick={() => onTabChange("likes")}
        >
          Likes
        </li>
      </ul>
    </nav>
  );
};

export default ProfileNavigation;
