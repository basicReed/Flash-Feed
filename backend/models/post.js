"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const User = require("./user.js");

class Post {
  /** Create a post (from data), update db, return new post data
   *
   * data should be {userId, txtContent, imgUrl, isPrivate}
   *
   * Returns {postId, userId, txtContent, imgUrl, isPrivate}
   *
   * Throws BadRequestError if user not found
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

  /** Finds all posts (if public)
   *
   * Returns [{postId, userId, txtContent, imgUrl, isPrivate, username, isLiked, numLikes, numComments, datePosted }]
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
    console.log("lenghth: ", results.rows.length);
    return results.rows;
  }

  /** Find all posts by user.
   *
   * Returns [{ postId, userId, txtContent, imgUrl, isPrivate, numLikes, numComments, dataPosted }]
   *
   * Throws NotFoundErros if user not found
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

    return posts;
  }

  /** Get post by id
   *
   * Returns {postId, userId, txtContent, imgUrl, isPrivate, datePosted}
   *
   * Throws NotFoundError if not found with postId
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

  /** Gets all post liked by user
   *
   * Returns [{postId, userId, txtContent, imgUrl, isPrivate, datePosted}]
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

    return liked;
  }

  /** Update post data
   *
   * Returns {postId, userId, txtContent, isPrivate, datePosted}
   *
   * Throws NotFoundError if post not found
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

  /** Delete post by id
   *
   *  Returns {postId, userId, txtContent, imgUrl, isPrivate, datePosted}
   *
   *  Throws NotFoundError if not post found with postId
   * */
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

  /** Get all posts bookmarked by user
   *
   * Returns [{ postId, userId, txtContent, imgUrl, isPrivate, numLikes, numComments, dataPosted }]
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

  /** Add or remove a bookmark for a post
   *
   * - userId: id of user bookmarking the post
   * - postId: id of post to be bookmarked/unbookmarked
   *
   * Returns true if bookmark was added, false if it was removed
   *
   * Throws NotFoundError if either the user or post is not found
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
