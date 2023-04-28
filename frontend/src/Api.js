import axios from "axios";

const BASE_API_URL = "https://flashfeedapp.herokuapp.com";

class FlashFeedApi {
  // POST to authenticate user and return JWT token
  static async login(username, password) {
    try {
      let { data } = await axios.post(`${BASE_API_URL}/auth/token`, {
        username,
        password,
      });
      return data.token;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error logging in user: ${username}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST to register a new user and return JWT token
  static async register(
    username,
    password,
    firstName,
    lastName,
    email,
    imageUrl
  ) {
    try {
      let { data } = await axios.post(`${BASE_API_URL}/auth/register`, {
        username,
        password,
        firstName,
        lastName,
        email,
        imageUrl,
      });
      return data.token;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error posting/registering new user: ${username}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET user profile information
  static async getUser(username) {
    try {
      let token = localStorage.getItem("token");
      let { data } = await axios.get(`${BASE_API_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.user;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching user with username: ${username}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET to search for users based on a search term
  static async searchUsers(searchTerm) {
    try {
      let token = localStorage.getItem("token");
      console.log(searchTerm);
      let response = await axios.get(
        `${BASE_API_URL}/users/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.users;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching users with search term like: ${searchTerm}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST to toggle following a user
  static async toggleFollow(username, followedUsername) {
    try {
      let token = localStorage.getItem("token");
      const data = { username, followedUsername };
      let response = await axios.post(`${BASE_API_URL}/follows/toggle`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error toggling follow for user: ${username} | followed: ${followedUsername}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET to check if a user is following another user
  static async isFollowing(followerUsername, followedUsername) {
    try {
      let token = localStorage.getItem("token");
      console.log("route check: ", followerUsername, followedUsername);
      let response = await axios.get(
        `${BASE_API_URL}/follows/is-following?followerUsername=${followerUsername}&followedUsername=${followedUsername}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching follow check for follower: ${followerUsername} | followed: ${followedUsername}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET users that current user follows.
  static async getFollowed(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/follows/${userId}/followed`,
        {
          headers,
        }
      );

      return response.data.users;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching followed for user with userId: ${userId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET followers of current user
  static async getFollowers(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/follows/${userId}/followers`,
        {
          headers,
        }
      );

      return response.data.users;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching followers for user with userId: ${userId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST to create new post
  static async post(txtContent, isPrivate, imgUrl) {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const data = { txtContent, isPrivate, imgUrl, username };
      const response = await axios.post(`${BASE_API_URL}/posts`, data, {
        headers,
      });

      return response.data.post;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error creating new post. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // Get post by ID
  static async getPost(postId, userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        `${BASE_API_URL}/posts/${postId}?userId=${userId}`,
        {
          headers,
        }
      );

      return response.data.post;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching post with postId: ${postId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET current users posts
  static async getUserPost(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_API_URL}/posts/user/${userId}`, {
        headers,
      });

      return response.data.posts;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching post with userId: ${userId} . Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET liked posts by current user.
  static async getLikedPost(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/posts/${userId}/liked`,
        {
          headers,
        }
      );

      return response.data.posts;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching liked post with userId: ${userId} . Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET all public(if not private) posts by all users.
  static async getAllPost(userId, pageNum) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/posts?user=${userId}&page=${pageNum}`,
        {
          headers,
        }
      );

      return response.data.posts;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching posts with userId: ${userId} | Page: ${pageNum}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET posts from user the current user follows.
  static async getMyFeed(userId, pageNum) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/posts/my-feed?user=${userId}&page=${pageNum}`,
        {
          headers,
        }
      );

      return response.data.posts;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching feed posts for userId: ${userId} | Page: ${pageNum}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // DELETE post by current user.
  static async deletePost(postId, userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${BASE_API_URL}/posts/${postId}?userId=${userId}`,
        {
          headers,
        }
      );

      return response.data.deleted;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error deleting post with userId: ${userId} | postId: ${postId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST toggling privacy for current users post.
  static async togglePostPrivacy(postId, userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const data = { postId, userId };
      const response = await axios.post(`${BASE_API_URL}/posts/private`, data, {
        headers,
      });

      return response.data.isPrivate;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error toggling post privacy userId: ${userId} | postId: ${postId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST toggling like for post.
  static async likeOrUnlike(postId, userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const data = { postId, userId };
      const response = await axios.post(`${BASE_API_URL}/posts/like`, data, {
        headers,
      });

      return response.data.like;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error liking posts with userId: ${userId} | postId: ${postId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET comments for post.
  static async getComments(postId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/comments/post/${postId}`,
        {
          headers,
        }
      );

      return response.data.comments;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching comments for post with postId: ${postId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST new comment for post.
  static async addComment(postId, userId, txtContent) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const data = { postId, userId, txtContent };
      const response = await axios.post(
        `${BASE_API_URL}/comments/create`,
        data,
        {
          headers,
        }
      );

      return response.data.comment;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error adding comment to post with postId: ${postId} | userId: ${userId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // GET bookmarks for current user.
  static async getUserBookmarks(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${BASE_API_URL}/users/${userId}/bookmarked`,
        {
          headers,
        }
      );

      return response.data.posts;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error fetching users bookmarked posts with userId: ${userId}. Please try again later.`;
      console.error(errorMessage);
    }
  }

  // POST toggling bookmark for current user.
  static async bookmarkOrRemove(userId, postId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const data = { userId, postId };

      const response = await axios.post(
        `${BASE_API_URL}/posts/bookmark`,
        data,
        {
          headers,
        }
      );
      return response.data.bookmark;
    } catch (error) {
      // Log and throw error if API call fails
      const errorMessage = `Error toggling bookmarked of post with postId: ${postId} | userId: ${userId}. Please try again later.`;
      console.error(errorMessage);
    }
  }
}

export default FlashFeedApi;
