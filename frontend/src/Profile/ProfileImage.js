import React from "react";
import "./ProfileImage.css";
import backupUserImg from "../Resources/backupUserImg.jpeg";

const ProfileImage = ({ imageUrl }) => {
  return (
    <div className="profile-image-container">
      <img
        className="profile-image"
        src={imageUrl || backupUserImg}
        alt="Profile"
        onError={(e) => {
          e.target.src = backupUserImg;
        }}
      />
    </div>
  );
};

export default ProfileImage;
