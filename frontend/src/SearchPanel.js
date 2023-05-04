import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import UserCard from "./UserCard";
import FlashFeedApi from "./Api";
import "./SearchPanel.css";

const SearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  // account for fast typing
  const SEARCH_DELAY = 500; // milliseconds
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = async (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(async () => {
        try {
          const fetchUsers = await FlashFeedApi.searchUsers(searchTerm);
          setUsers(fetchUsers);
        } catch (err) {
          console.error(err);
        }
      }, SEARCH_DELAY)
    );
  };

  const handleUserSearch = async () => {
    try {
      const fetchUsers = await FlashFeedApi.searchUsers(searchTerm);
      setUsers(fetchUsers);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-panel-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Flash Feed"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleUserSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <div className="search-sections">
        <div className="user-search-section">
          <h2>People</h2>
          <p>Find people you know</p>
          <button onClick={handleUserSearch}>
            Search users for "{searchTerm}"
          </button>
          {users.map((user) => (
            <UserCard key={user.userId} {...user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
