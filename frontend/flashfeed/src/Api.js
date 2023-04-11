import axios from "axios";

const BASE_API_URL = "http://localhost:3001";

class FlashFeedApi {
  static async login(username, password) {
    let { data } = await axios.post(`${BASE_API_URL}/auth/token`, {
      username,
      password,
    });
    return data.token;
  }

  static async register(
    username,
    password,
    firstName,
    lastName,
    email,
    imageUrl
  ) {
    let { data } = await axios.post(`${BASE_API_URL}/auth/register`, {
      username,
      password,
      firstName,
      lastName,
      email,
      imageUrl,
    });
    return data.token;
  }

  static async getUser(username) {
    let token = localStorage.getItem("token");
    let { data } = await axios.get(`${BASE_API_URL}/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
  }

  static async searchUsers(searchTerm) {
    let token = localStorage.getItem("token");
    console.log(searchTerm);
    let response = await axios.get(
      `${BASE_API_URL}/users/search?q=${searchTerm}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response.data);
    return response.data.users;
  }

  static async toggleFollow(username, followedUsername) {
    let token = localStorage.getItem("token");
    const data = { username, followedUsername };
    let response = await axios.post(`${BASE_API_URL}/follows/toggle`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  static async isFollowing(followerUsername, followedUsername) {
    let token = localStorage.getItem("token");
    console.log("route check: ", followerUsername, followedUsername);
    let response = await axios.get(
      `${BASE_API_URL}/follows/is-following?followerUsername=${followerUsername}&followedUsername=${followedUsername}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }

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
      console.error(error);
    }
  }

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
      console.error(error);
    }
  }

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
      console.error(error);
      throw error;
    }
  }

  static async getPost(postId, userId) {
    try {
      console.log("userId API: ", userId);
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
      console.error(error);
      throw error;
    }
  }

  static async getUserPost(userId) {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_API_URL}/posts/user/${userId}`, {
        headers,
      });

      return response.data.posts;
    } catch (error) {
      console.error(error);
    }
  }

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
      console.error(error);
    }
  }

  static async getAllPost(userId, pageNum) {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${BASE_API_URL}/posts?user=${userId}&page=${pageNum}`,
      {
        headers,
      }
    );

    return response.data.posts;
  }

  static async likeOrUnlike(postId, userId) {
    console.log("POST ID CHECK 2: ", postId);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const data = { postId, userId };
    const response = await axios.post(`${BASE_API_URL}/posts/like`, data, {
      headers,
    });

    return response.data.like;
  }

  static async getComments(postId) {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${BASE_API_URL}/comments/post/${postId}`,
      {
        headers,
      }
    );

    return response.data.comments;
  }

  static async addComment(postId, userId, txtContent) {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const data = { postId, userId, txtContent };
    const response = await axios.post(`${BASE_API_URL}/comments/create`, data, {
      headers,
    });

    return response.data.comment;
  }

  static async getUserBookmarks(userId) {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(
      `${BASE_API_URL}/users/${userId}/bookmarked`,
      {
        headers,
      }
    );

    return response.data.posts;
  }

  static async bookmarkOrRemove(userId, postId) {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const data = { userId, postId };

    const response = await axios.post(`${BASE_API_URL}/posts/bookmark`, data, {
      headers,
    });
    return response.data.bookmark;
  }
}

export default FlashFeedApi;
