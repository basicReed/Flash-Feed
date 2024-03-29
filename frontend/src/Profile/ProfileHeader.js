import React from "react";
import backupUserImg from "../Resources/backupUserImg.jpeg";
import "./ProfileHeader.css";
import moment from "moment";

const ProfileHeader = ({ user, numPosts, numFollowing, numFollowers }) => {
  return (
    <div className="header">
      <div className="profile-image">
        <div className="profile-image">
          <img
            src={user.profileImage || backupUserImg}
            alt="Profile"
            onError={(e) => {
              e.target.src = backupUserImg;
            }}
          />
        </div>
      </div>
      <div className="profile-info">
        <h1>{user.firstName}</h1>
        <p>@{user.username}</p>
        <p>This is bio</p>
        <ul>
          <li>
            <i className="far fa-calendar-alt"></i>Joined{" "}
            {moment(Date.parse(user.dateJoined)).format("MMM D YYYY")}
          </li>
        </ul>
      </div>
      <div className="stats">
        <div className="stat">
          <p>Posts</p>
          <p>{numPosts}</p>
        </div>
        <div className="stat">
          <p>Followers</p>
          <p>{numFollowers}</p>
        </div>
        <div className="stat">
          <p>Following</p>
          <p>{numFollowing}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
