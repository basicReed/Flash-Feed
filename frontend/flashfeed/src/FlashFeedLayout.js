import React from "react";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import SearchPanel from "./SearchPanel";

import "./FlashFeedLayout.css";

function FlashFeedLayout({ title, children }) {
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
