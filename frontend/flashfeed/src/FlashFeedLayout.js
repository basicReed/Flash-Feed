import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import SearchPanel from "./SearchPanel";

import "./FlashFeedLayout.css";

function FlashFeedLayout({ title, children }) {
  const navigate = useNavigate();

  const activeUsername = localStorage.getItem("username");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="Homepage">
      <div className="col1">
        <NavBar />
      </div>
      <div className="col2">
        <TopBar />
        {children}
      </div>
      <div className="col3">
        <SearchPanel />
      </div>
    </div>
  );
}

export default FlashFeedLayout;
