import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookmark,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const { removeUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeUser();
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li>
              <h1>LOGO HERE</h1>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/home" exact>
                <FontAwesomeIcon icon={faHome} />
                <span className="ms-2">Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bookmarks" exact>
                <FontAwesomeIcon icon={faBookmark} />
                <span className="ms-2">Bookmarks</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={`/profile/${localStorage.getItem("username")}`}
                exact
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ms-2">Profile</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" onClick={handleLogout} to="/">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="ms-2">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
