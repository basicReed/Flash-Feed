import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { useParams } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";
import ProfileNavigation from "./ProfileNavigation";
import FlashFeedApi from "../Api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const activeUsername = localStorage.getItem("username");
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(user.username);
  const [postCount, setPostCount] = useState("-");
  const [followerCount, setFollowerCount] = useState("-");
  const [followingCount, setFollowingCount] = useState("-");
  const [isLoading, setIsLoading] = useState(true);

  // Set active tap for ProfileContent to render
  const onTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Update follow count when click follow/unfollow toggle
  const followingCountUpdate = (follow) => {
    if (username == activeUsername) {
      follow
        ? setFollowingCount(followingCount + 1)
        : setFollowingCount(followingCount - 1);
    }
  };

  // On username change: set profile header values
  useEffect(() => {
    async function getUserData() {
      setIsLoading(true);
      setActiveTab("posts");
      const fetchedUser = await FlashFeedApi.getUser(username);
      setUserData(fetchedUser);
      setPostCount(fetchedUser.postCount);
      setFollowerCount(fetchedUser.followersCount);
      setFollowingCount(fetchedUser.followingCount);
      setIsLoading(false);
    }
    getUserData();
  }, [username]);

  return (
    <div>
      <ProfileHeader
        user={userData}
        numPosts={postCount}
        numFollowers={followerCount}
        numFollowing={followingCount}
      />
      <ProfileNavigation activeTab={activeTab} onTabChange={onTabChange} />
      {!isLoading && (
        <ProfileContent
          activeTab={activeTab}
          user={userData}
          followingCountUpdate={followingCountUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
