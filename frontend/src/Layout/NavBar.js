import React, { useContext } from "react";
import { AuthContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookmark,
  faUser,
  faSignOutAlt,
  faSearch,
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
    <nav className="navbar ">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-iten nav-logo">
              <img src="/logo105.png" />
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                <FontAwesomeIcon icon={faHome} />
                <span className="ms-2">Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bookmarks">
                <FontAwesomeIcon icon={faBookmark} />
                <span className="ms-2">Bookmarks</span>
              </NavLink>
            </li>

            <li className={`nav-item nav-search `}>
              <NavLink className="nav-link" to="/search">
                <FontAwesomeIcon icon={faSearch} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={`/profile/${localStorage.getItem("username")}`}
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
