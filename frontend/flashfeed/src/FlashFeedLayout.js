import React, {useContext} from "react";
import { useAuth } from "./App";
import { Navigate } from "react-router-dom";

import NavBar from "./NavBar";
import TopBar from "./TopBar";
import SearchPanel from "./SearchPanel";

import "./FlashFeedLayout.css";

function FlashFeedLayout({ title, children }) {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

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
