import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import FlashFeedApi from "../Api";
import "./PostOptions.css";

const PostOptions = ({ user, postId, isPrivate, onDelete, username }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [privacy, setPrivacy] = useState(isPrivate);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleEllipsisClick = () => {
    setShowMenu(!showMenu);
  };

  const handleTogglePrivate = async () => {
    setShowMenu(false);
    //Set automatically
    setPrivacy(!privacy);
    // Make API call to make the post public (expecty boolean if private)
    const resp = await FlashFeedApi.togglePostPrivacy(postId, user.userId);
    // Check change to display correct privacy data
    setPrivacy(resp.isPrivate);
  };

  const handleViewProfile = () => {
    setShowMenu(false);
    // Navigate to the user's profile page
    navigate(`/profile/${username}`);
  };

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  const isOwner = user.username === username;

  // Options for post menu
  const options = isOwner
    ? [
        { text: "Delete", onClick: onDelete },
        {
          text: privacy ? "Make Public" : "Make Private",
          onClick: handleTogglePrivate,
        },
      ]
    : [{ text: "View Profile", onClick: handleViewProfile }];

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  return (
    <div className="post-options">
      {privacy && <i className="fas fa-lock" title="This post is private"></i>}
      <button className="ellipsis-btn" onClick={handleEllipsisClick}>
        <i className="fas fa-ellipsis-h"></i>
      </button>
      {showMenu && (
        <div className="options-menu" ref={menuRef}>
          {options.map(({ text, onClick }, index) => (
            <button key={index} onClick={onClick}>
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostOptions;
