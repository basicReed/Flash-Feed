import "./App.css";
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import FlashFeedLayout from "./FlashFeedLayout";
import FlashFeed from "./FlashFeed";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";
import PostAndComments from "./PostAndComments";
import LoadingIcon from "./LoadingIcon";
import FlashFeedApi from "./Api";

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
          <Routes>
            <Route path="/" exact="true" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              exact="true"
              element={
                isAuthenticated && !isLoading ? (
                  <Navigate to="/home" />
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
                  <Navigate to="/home" />
                ) : (
                  <Register storeUser={storeUser} />
                )
              }
            />

            {!isLoading && (
              <>
                <Route
                  path="/*"
                  element={
                    isAuthenticated ? (
                      <FlashFeedLayout>
                        <Routes>
                          <Route
                            path="/home"
                            element={<FlashFeed key={"Home"} />}
                          />
                          <Route
                            path="/home/my-feed"
                            element={<FlashFeed key={"Feed"} />}
                          />
                          <Route path="/bookmarks" element={<Bookmarks />} />
                          <Route
                            path="/profile/:username"
                            element={<Profile />}
                          />
                          <Route
                            path="/post/:postId"
                            element={<PostAndComments />}
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
