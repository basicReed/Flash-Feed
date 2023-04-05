import React, { useState } from "react";
import "./ProfileImage.css";
import backupUserImg from "./backupUserImg.jpeg";

const ProfileImage = ({ imageUrl }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const checkImgSrc = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  const onError = async () => {
    try {
      const isValidImg = await checkImgSrc(imageUrl);
      if (!isValidImg) {
        setImgSrc(backupUserImg);
      }
    } catch (error) {
      setImgSrc(backupUserImg);
    }
  };

  return (
    <div className="profile-image-container">
      <img
        className="profile-image"
        src={imgSrc}
        alt="Profile"
        onError={(e) => {
          e.target.onError = null;
          onError();
        }}
      />
    </div>
  );
};

export default ProfileImage;
