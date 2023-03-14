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
    const results = await db.query(
      `INSERT INTO post (user_id, txt_content, img_url, is_private)
            VALUES ($1, $2, $3, $4), 
            RETURNING post_id, user_id, txt_content AS "txtContent, img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"
            `,
      [data.userId, data.txtContent, data.imgUrl, data.isPrivate]
    );

    const post = results.rows[0];

    return post;
  }

  /** Finds all posts (if public)
   *
   * Returns [{postId, userId, txtContent, imgUrl, isPrivate, username}]
   */

  static async getAll(userId) {
    const results = db.query(
      `
        SELECT post.post_id AS "postId",
                post.user_id AS "userId",
                post.txt_content AS "txtContent",
                post.img_url AS "imgUrl",
                post.is_private AS "isPrivate",
                users.username,
                post.date_posted AS "datePosted",
                (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id = $1 AND likes.post_id = post.post_id)) AS "isLiked"
        FROM post
        JOIN users ON post.user_id = users.user_id
        WHERE is_private = $2 OR post.user_id = $1
        ORDER BY date_posted`,
      [userId, false]
    );
    return results.rows;
  }

  /** Find all posts by user.
   *
   * Returns [{ postId, userId, txtContent, imgUrl, isPrivate, dataPosted }]
   *
   * Throws NotFoundErros if user not found
   */

  static async getAllByUser(userId) {
    // Ensure user exists
    await User.getById(userId);
    // Find post by user

    const result = db.query(
      `
        SELECT post_id AS postId,
                user_id AS userId,
                txt_content, txtContent,
                img_url AS imgUrl,
                is_private AS isPrivate,
                date_posted AS datePosted
        FROM post
        WHERE user_id = $1
        ORDER BY date_posted
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

  static async get(postId, userId) {
    const result = db.query(
      ` SELECT p.post_id AS postId,
            p.user_id AS userId,
            p.txt_conten AS txtContent,
            p.img_url AS imgUrl,
            p.is_private AS isPrivate,
            p.date_posted AS datePosted,
            EXISTS (
                SELECT 1 FROM likes l
                WHERE l.user_id = $2 AND l.post_id = $1
              ) AS "isLiked"
        FROM post p
        WHERE p.post_id = $1
        ORDER BY p.date_posted
        `,
      [postId, userId]
    );
    const post = result.rows[0];

    if (!post) throw new NotFoundError(`Post not found with id ${postId}`);

    return post;
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
              post.txt_content AS "txtContent",
              post.img_url AS "imgUrl",
              post.is_private AS "isPrivate",
              post.date_posted AS "datePosted"
      FROM likes
      JOIN post ON likes.post_id = post.post_id
      WHERE likes.user_id = $1`,
      [userId]
    );

    return results.rows;
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
            RETURNING post_id AS "postId", user_id AS "userId", txt_content AS "txtContent", img_url AS imgUrl, is_private AS "isPrivate", data_posted AS "datePosted" `,
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
            RETURNING post_id AS "postId", user_id AS "userId", txt_content AS "txtContent", img_url AS imgUrl, is_private AS "isPrivate", data_posted AS "datePosted" `,
      [postId]
    );
    if (result.rows.length === 0)
      throw new NotFoundError(`Post not found with id ${postId}`);

    return result.rows[0];
  }

  /** Like a post (updates likes table)
   *
   * Returns true
   *
   * Throws BadRequestError if user already likes post
   * Thows NotFoundError if !post
   */

  static async like(postId, userId) {
    //Check if post exist
    await Post.get(postId);
    //Check if user exist
    await User.getById(userId);

    // Check if the user already liked the post
    const likeRes = await db.query(
      `SELECT post_id, user_id
              FROM likes
              WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    if (likeRes.rows.length > 0)
      throw new BadRequestError(`User already liked post with id ${postId}`);

    const res = await db.query(
      `INSERT INTO likes (post_id, user_id)
         VALUES ($1, $2)
         RETURNING post_id`,
      [postId, userId]
    );
    if (!res.rows[0]) throw new NotFoundError(`Like not found`);
    return true;
  }

  /** Unlike a post (updates likes table)
   *
   * Returns true
   *
   * Throws BadRequestError if user does not already like the post
   * Thows NotFoundError if !post
   */

  static async unlike(postId, userId) {
    // Check if post exists
    await Post.get(postId);
    //Check if user exists
    await User.getById(userId);

    // Check if the user already unliked the post
    const likeRes = await db.query(
      `SELECT post_id, user_id
              FROM likes
              WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    if (likeRes.rows.length === 0)
      throw new BadRequestError(`User did not like post with id ${postId}`);

    const res = await db.query(
      `DELETE FROM likes
         WHERE post_id = $1 AND user_id = $2
         RETURNING post_id`,
      [postId, userId]
    );
    if (!res.rows[0]) throw new NotFoundError(`Like not found`);
    return true;
  }
}

module.exports = Post;
