import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import SearchPanel from "./SearchPanel";
import { useLocation } from "react-router-dom";

import "./FlashFeedLayout.css";

function FlashFeedLayout({ children }) {
  const [searchActive, setSearchActive] = useState(false);
  let location = useLocation();

  // display search on smaller devices
  useEffect(() => {
    if (location.pathname === "/search") {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  }, [location.pathname]);

  return (
    <div className="Homepage">
      <div className="col1">
        <NavBar />
      </div>
      <div className="col2">
        <TopBar />
        {children}
      </div>
      <div className={`col3 ${searchActive ? "active" : ""}`}>
        <SearchPanel />
      </div>
    </div>
  );
}

export default FlashFeedLayout;
