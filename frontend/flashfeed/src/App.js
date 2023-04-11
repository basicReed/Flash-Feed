import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import FlashFeedLayout from "./FlashFeedLayout";
import FlashFeed from "./FlashFeed";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";
import PostAndComments from "./PostAndComments";
import FlashFeedApi from "./Api";
import NavBar from "./NavBar";
import { Provider } from "react-redux";

export const AuthContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  /**
   * Checks if token is present & setsIsAthenticated
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      // get and set user data for each page if authenticated
      async function fetchData() {
        try {
          let userData = await FlashFeedApi.getUser(username);
          console.log("USER DATA: ", userData);
          setUser(userData);
          setIsLoading(false);
          console.log(userData);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  /**
   *  Stores user data in local storage and sets authentication
   */
  async function storeUser(token, username) {
    //store token in LS
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
  }

  /**
   * Remove user data from local storage and authentication
   */
  async function removeUser() {
    localStorage.clear();
    setUser({});
    setIsAuthenticated(false);
  }

//////////////////////////////////////////
///// Routes//////////////////////////////
//////////////////////////////////////////
  return (
    <div className="App-background">
      <AuthContext.Provider
        value={{
          isAuthenticated,
          removeUser,
          user,
        }}
      >
        <BrowserRouter>
          {/* {isLoading ? <Loading /> : null} */}
          {/* {isAuthenticated ? <NavBar /> : null} */}
          <Routes>
            <Route path="/" exact="true" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              exact="true"
              element={
                isAuthenticated && !isLoading ? (
                  <Navigate to="/flashfeed" />
                ) : (
                  <Login storeUser={storeUser} />
                )
              }
            />
            <Route
              path="/register"
              exact="true"
              element={
                isAuthenticated ? (
                  <Navigate to="/flashfeed" />
                ) : (
                  <Register storeUser={storeUser} />
                )
              }
            />
            {!isLoading && (
              <>
                <Route
                  path="/flashfeed"
                  element={
                    isAuthenticated ? (
                      <FlashFeedLayout title="Home">
                        <Routes>
                          <Route path="/" element={<FlashFeed user={user} />} />
                          <Route
                            path="/bookmarks"
                            element={<Bookmarks user={user} />}
                          />
                          <Route path="/" element={<Profile user={user} />} />
                        </Routes>
                      </FlashFeedLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    isAuthenticated ? (
                      <FlashFeedLayout title="Bookmarks">
                        <Routes>
                          <Route path="/" element={<Bookmarks user={user} />} />
                        </Routes>
                      </FlashFeedLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    isAuthenticated ? (
                      <FlashFeedLayout title={"Profile"}>
                        <Routes>
                          <Route path="/" element={<Profile user={user} />} />
                        </Routes>
                      </FlashFeedLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/post/:postId"
                  element={
                    isAuthenticated ? (
                      <FlashFeedLayout title="Post">
                        <Routes>
                          <Route
                            path="/"
                            element={<PostAndComments user={user} />}
                          />
                        </Routes>
                      </FlashFeedLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
