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
import useLocalStorage from "./useLocalStorage";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();
export const TOKEN_STORAGE_ID = "token";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  /**
   * Checks if token is present & setsIsAthenticated
   */

  useEffect(() => {
    async function fetchData() {
      if (token) {
        try {
          let decodedToken = jwt_decode(token);
          let userData = await FlashFeedApi.getUser(decodedToken.username);
          setUser(userData);
        } catch (error) {
          console.log(error);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchData();
  }, [token]);

  /**
   *  Stores user data in local storage and sets authentication
   */
  async function storeUser(newToken, username) {
    //store token in LS
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setToken(newToken);
  }

  /**
   * Remove user data from local storage and authentication
   */
  async function removeUser() {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(true);
    setToken(null);
  }

  //////////////////////////////////////////
  ///// Routes//////////////////////////////
  //////////////////////////////////////////
  if (isLoading) return <LoadingIcon />;

  return (
    <div className="App-background">
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          removeUser,
          user,
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" />} /> */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Login storeUser={storeUser} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Register storeUser={storeUser} />
                )
              }
            />
            <>
              <Route
                path="/*"
                element={
                  user ? (
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
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
