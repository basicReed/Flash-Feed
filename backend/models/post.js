"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const User = require("./user.js");

/** Related functions for posts */
class Post {
  /**
   * Create a post (from data), update db, and return new post data.
   *
   * @param {object} data - The data needed to create a post, including userId, txtContent, imgUrl, and isPrivate.
   *
   * @returns {Promise< {postId, userId, txtContent, imgUrl, isPrivate, and datePosted}}
   *
   * @throws {BadRequestError} If the user is not found.
   */

  static async create(data) {
    // Ensure user exists

    await User.getById(data.userId);

    // Create Post
    let query = `INSERT INTO post (user_id, txt_content, is_private) 
                  VALUES ($1, $2, $3) 
                  RETURNING post_id, user_id, txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"`;

    let queryParams = [data.userId, data.txtContent, data.isPrivate];

    if (data.imgUrl) {
      query = `INSERT INTO post (user_id, txt_content, is_private, img_url) VALUES ($1, $2, $3, $4) RETURNING post_id, user_id, txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"`;
      queryParams.push(data.imgUrl);
    }

    const results = await db.query(query, queryParams);

    const post = await Post.get(
      results.rows[0].user_id,
      results.rows[0].post_id
    );

    return post;
  }

  /**
   * Finds all public posts or private posts belonging to the provided user id
   *
   * @param {number} userId - The id of the user requesting the posts
   * @param {number} pageNum - The page number of the requested posts (starting at 1)
   * @returns {Promise<{postId: number, userId: number, text: string, imgUrl: string, isPrivate: boolean, username: string, profileImgUrl: string, timestamp: Date, isLiked: boolean, numLikes: number, numComments: number, isBookmarked: boolean}>}
   */

  static async getAll(userId, pageNum) {
    const pageSize = 10;
    const offset = (pageNum - 1) * pageSize;

    const results = await db.query(
      `
      SELECT post.post_id AS "postId",
             post.user_id AS "userId",
             post.txt_content AS "text",
             post.img_url AS "imgUrl",
             post.is_private AS "isPrivate",
             users.username,
             users.image_url AS "profileImgUrl",
             post.date_posted AS "timestamp",
             (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
             (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
             (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
             (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
      FROM post
      JOIN users ON post.user_id = users.user_id
      WHERE (is_private = $2 OR post.user_id = $1)
      ORDER BY date_posted DESC
      LIMIT $3 OFFSET $4
    `,
      [userId, false, pageSize, offset]
    );

    return results.rows;
  }

  /**  NOT USED YET ****
   * Retrieves all posts from users followed by the given user (if public).
   *
   * @param {number} userId - The user ID of the follower.
   * @param {number} pageNum - The page number of results to retrieve.
   * @returns {Promise<{postId: number, userId: number, text: string, imgUrl: string, isPrivate: boolean, username: string, profileImgUrl: string, timestamp: Date, isLiked: boolean, numLikes: number, numComments: number, isBookmarked: boolean }}
   */
  static async getAllFromFollowed(userId, pageNum) {
    const pageSize = 10;
    const offset = (pageNum - 1) * pageSize;

    const results = await db.query(
      ` SELECT post.post_id AS "postId",
          post.user_id AS "userId",
          post.txt_content AS "text",
            post.img_url AS "imgUrl",
          post.is_private AS "isPrivate",
          users.username,
          users.image_url AS "profileImgUrl",
          post.date_posted AS "timestamp",
          (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
          (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
          (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
          (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
      FROM post
      JOIN users ON post.user_id = users.user_id
      JOIN follow ON follow.followed_id = post.user_id
      WHERE (is_private = $2 OR post.user_id = $1)
      AND follow.follower_id = $1
      ORDER BY date_posted DESC
      LIMIT $3 OFFSET $4`,
      [userId, false, pageSize, offset]
    );

    return results.rows;
  }

  /**
   * Retrieve all posts made by a specific user.
   *
   * @param {number} userId - The ID of the user whose posts to retrieve.
   * @returns {Promise< {postId, userId, txtContent, imgUrl, isPrivate, username, isLiked, numLikes, numComments, and datePosted properties}}
   * @throws {NotFoundError} If user is not found.
   */

  static async getAllByUser(userId) {
    // Ensure user exists
    await User.getById(userId);
    // Find post by user

    const result = await db.query(
      `
      SELECT post.post_id AS "postId",
                post.user_id AS "userId",
                post.txt_content AS "text",
                post.img_url AS "imgUrl",
                post.is_private AS "isPrivate",
                users.username,
                users.image_url AS "profileImgUrl",
                post.date_posted AS "timestamp",
                (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
                (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
                (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
        FROM post
        JOIN users ON post.user_id = users.user_id
        WHERE post.user_id = $1
        ORDER BY post.date_posted
    `,
      [userId]
    );
    const posts = result.rows;

    if (!result.rows[0])
      throw new NotFoundError(`No posts not found for user: ${userId}`);

    return posts;
  }

  /**
   * Get a post by its ID
   * @param {string} userId - ID of the user making the request
   * @param {string} postId - ID of the post to retrieve
   * @returns {Promise<{postId, userId, txtContent, imgUrl, isPrivate, datePosted, username, profileImgUrl, isLiked, numLikes, numComments, isBookmarked }}
   * @throws {NotFoundError} If no post is found with the specified postId
   */

  static async get(userId, postId) {
    const result = await db.query(
      ` SELECT post.post_id AS "postId",
                post.user_id AS "userId",
                post.txt_content AS "text",
                post.img_url AS "imgUrl",
                post.is_private AS "isPrivate",
                users.username,
                users.image_url AS "profileImgUrl",
                post.date_posted AS "timestamp",
                (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
                (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
                (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
        FROM post
        JOIN users ON post.user_id = users.user_id
        WHERE post.post_id = $2
        ORDER BY post.date_posted
        `,
      [userId, postId]
    );
    const post = result.rows[0];

    if (!post) throw new NotFoundError(`Post not found with id ${postId}`);

    return post;
  }

  /**
   * Check if a post with a given postId exists in the database.
   *
   * @param {number} postId - The ID of the post to check
   * @returns {Object} The post object if found
   * @throws {NotFoundError} If post not found with given postId
   */
  static async doesExist(postId) {
    const query = `
      SELECT
        post_id AS "postId"
      FROM post
      WHERE post_id = $1
    `;
    const result = await db.query(query, [postId]);
    if (result.rows.length === 0) {
      throw new NotFoundError(`Post not found with id ${postId}`);
    }
    return result.rows[0];
  }

  /**
   * Gets all posts liked by a user.
   *
   * @param {string} userId - The id of the user whose liked posts are being fetched.
   * @returns {Promise <{postId, userId, txtContent, imgUrl, isPrivate, datePosted, isLiked, numLikes, numComments, isBookmarked}}
   * @throws {NotFoundError} If the user with the given userId does not exist in the database.
   */
  static async getLiked(userId) {
    //Check if user exist
    await User.getById(userId);

    const results = await db.query(
      `SELECT post.post_id AS "postId",
        post.user_id AS "userId",
        post.txt_content AS "text",
        post.img_url AS "imgUrl",
        post.is_private AS "isPrivate",
        users.username AS "username",
        users.image_url AS "profileImgUrl",
        post.date_posted AS "timestamp",
        (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
        (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
        (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
      FROM post
      JOIN users ON post.user_id = users.user_id
      JOIN likes ON post.post_id = likes.post_id
      WHERE likes.user_id = $1
      ORDER BY post.date_posted;
      `,
      [userId]
    );
    const liked = results.rows;

    if (!results.rows[0])
      throw new NotFoundError(`No Liked Post for user: ${userId}`);

    return liked;
  }

  /** NOT USED YET ***
   * Updates post data
   *
   * @param {number} postId - The ID of the post to be updated
   * @param {object} data - An object containing the updated post data
   * @param {string} [data.txtContent] - The updated text content of the post
   * @param {string} [data.imgUrl] - The updated image URL of the post
   * @param {boolean} [data.isPrivate] - The updated privacy status of the post
   * @returns {Promise<{postId:number, userId:number, txtContent:string, imgUrl:string, isPrivate:boolean, datePosted:Date}>} - The updated post object
   * @throws {NotFoundError} - If post not found with the provided postId
   */

  static async update(postId, data) {
    // Check if post exists
    // Throw NotFoundError if !post
    const post = await Post.get(postId);

    // Update post (default return "post" data if not in update data)
    const result = await db.query(
      `UPDATE post
            SET txt_content = $1,
                img_url = $2,
                is_private = $3
            WHERE post_id = $4
            RETURNING post_id AS "postId", user_id AS "userId", txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted" `,
      [
        data.txtContent || post.txtContent,
        data.imgUrl || post.imgUrl,
        data.isPrivate || post.isPrivate,
        postId,
      ]
    );

    const updatedPost = result.rows[0];
    return updatedPost;
  }

  /**
   * Delete a post by its id
   *
   * @param {number} postId - The id of the post to be deleted
   * @returns {Promise<{postId, userId, txtContent, imgUrl, isPrivate, datePosted}}
   * @throws {NotFoundError} If no post is found with the given postId
   */

  static async delete(postId) {
    const result = await db.query(
      `DELETE FROM post
            WHERE post_id = $1
            RETURNING post_id AS "postId", user_id AS "userId", txt_content AS "txtContent", img_url AS imgUrl, is_private AS "isPrivate", date_posted AS "datePosted" `,
      [postId]
    );
    if (result.rows.length === 0)
      throw new NotFoundError(`Post not found with id ${postId}`);

    return result.rows[0];
  }

  static async likeOrUnlike(postId, userId) {
    // Check if post exists
    await Post.doesExist(postId);
    // Check if user exists
    await User.getById(userId);

    // Check if the user already liked the post
    const likeRes = await db.query(
      `SELECT post_id, user_id
              FROM likes
              WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (likeRes.rows.length > 0) {
      // Unlike the post if the user has already liked it
      const res = await db.query(
        `DELETE FROM likes
             WHERE post_id = $1 AND user_id = $2
             RETURNING post_id`,
        [postId, userId]
      );
      if (!res.rows[0]) throw new NotFoundError(`Like not found`);

      return false;
    } else {
      // Like the post if the user has not liked it
      const res = await db.query(
        `INSERT INTO likes (post_id, user_id)
             VALUES ($1, $2)
             RETURNING post_id`,
        [postId, userId]
      );
      if (!res.rows[0]) throw new NotFoundError(`Like not found`);

      return true;
    }
  }

  /**
   * Toggles privacy of post by id for user with userId
   *
   * @param {string} postId - The id of the post to toggle privacy
   * @param {string} userId - The id of the user who owns the post
   * @returns {boolean} - The updated privacy status of the post (true for private, false for public)
   * @throws {NotFoundError} - If no post is found with the given postId or if no user is found with the given userId
   */

  static async togglePrivacy(postId, userId) {
    // Check if post exists
    await Post.doesExist(postId);
    // Check if user exists
    await User.getById(userId);

    const results = await db.query(
      `
            UPDATE post
            SET is_private = NOT is_private
            WHERE post_id = $1 AND user_id = $2
            RETURNING is_private AS "isPrivate";
            `,
      [postId, userId]
    );
    const isPrivate = results.rows[0];

    return isPrivate;
  }

  /**
   * Get all posts bookmarked by a user
   *
   * @param {number} userId - The ID of the user whose bookmarks to retrieve
   * @returns {Promise<{postId {number}, userId {number}, text {string}, imgUrl {string}, isPrivate {boolean}, username {string}, profileImgUrl {string}, timestamp {Date}, isLiked {boolean}, numLikes {number}, numComments {number, isBookmarked {boolean}}}
   */
  static async getBookmarked(userId) {
    const result = await db.query(
      `SELECT post.post_id AS "postId",
              post.user_id AS "userId",
              post.txt_content AS "text",
              post.img_url AS "imgUrl",
              post.is_private AS "isPrivate",
              users.username,
              users.image_url AS "profileImgUrl",
              post.date_posted AS "timestamp",
              (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked",
              (SELECT COUNT(*) FROM likes WHERE likes.post_id = post.post_id) AS "numLikes",
              (SELECT COUNT(*) FROM comment WHERE comment.post_id = post.post_id) AS "numComments",
              (SELECT EXISTS(SELECT * FROM bookmarks WHERE bookmarks.user_id = $1 AND bookmarks.post_id = post.post_id)) AS "isBookmarked"
        FROM post
        JOIN users ON post.user_id = users.user_id
        JOIN bookmarks ON bookmarks.post_id = post.post_id
        WHERE bookmarks.user_id = $1
        ORDER BY post.date_posted`,
      [userId]
    );
    const posts = result.rows;

    return posts;
  }

  /**
   * Adds or removes a bookmark for a post
   *
   * @param {number} userId - ID of the user bookmarking the post.
   * @param {number} postId - ID of the post to be bookmarked/unbookmarked.
   * @returns {Promise<boolean>} - Returns true if the bookmark was added, false if it was removed.
   * @throws {NotFoundError} - If either the user or post is not found.
   */

  static async bookmark(userId, postId) {
    // Ensure user and post exist
    await User.getById(userId);
    await Post.doesExist(postId);

    // Check if user has bookmarked post
    const result = await db.query(
      `SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );
    const bookmark = result.rows[0];

    if (bookmark) {
      // If bookmark exists, remove it
      await db.query(
        `DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
      );
      return false;
    } else {
      // If bookmark doesn't exist, add it
      await db.query(
        `INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)`,
        [userId, postId]
      );
      return true;
    }
  }
}

module.exports = Post;
