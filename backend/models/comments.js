"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for comments */
class Comment {
  /**
   * Create a new comment in the database
   *
   * @param {Object} data - An object containing the `postId`, `userId`, and `txtContent` fields
   *
   * @returns {Object} - The newly created comment object with fields `commentId`, `userId`, `txtContent`, `postId`, and `dateCommented`
   *
   * @throws {Error} - If there's an error creating the comment
   */

  static async create(data) {
    const { postId, userId, txtContent } = data;

    try {
      // create comment
      const result = await db.query(
        `INSERT INTO comment (post_id, user_id, txt_content) 
          VALUES ($1, $2, $3) 
          RETURNING comment_id AS "commentId", user_id, txt_content, post_id, date_commented`,
        [postId, userId, txtContent]
      );

      const comment = result.rows[0];

      if (!comment) throw new Error(`Error creating comment: ${txtContent}`);

      // get user and post info for comment
      const query = `
        SELECT 
          comment.txt_content AS "txtContent", 
          comment.comment_id AS "commentId",
          comment.post_id AS "postId",
          comment.date_commented AS "dateCommented",
          users.user_id AS "userId",
          users.image_url AS "profileImgUrl",
          users.username
        FROM comment
        JOIN users ON comment.user_id = users.user_id
        WHERE comment.comment_id = $1
      `;
      const res = await db.query(query, [comment.commentId]);

      const newComment = res.rows[0];
      if (!newComment)
        throw new Error(`Error getting comment info: ${comment.commentId}`);

      return newComment;
    } catch (err) {
      console.error("Error creating comment:", err);
      throw new Error(`Error creating comment: ${err.message}`);
    }
  }

  /**
   * Delete a comment from the database
   *
   * @param {number} commentId - The ID of the comment to delete
   *
   * @returns {boolean} - `true` if the comment was deleted successfully
   *
   * @throws {NotFoundError} - If the comment with `commentId` is not found in the database
   */

  static async delete(commentId) {
    const result = await db.query(
      `DELETE FROM comment
       WHERE comment_id = $1
       RETURNING comment_id AS "commentId"`,
      [commentId]
    );
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`Comment ${commentId} not found`);

    return true;
  }

  /**
   * Retrieves all comments for a given post.
   *
   * @param {number} postId - The ID of the post for which to retrieve comments
   * @returns {Promise<Array>} - An array of comment objects containing the text content and username of the user who created each comment
   * @throws {Error} If there's an error retrieving the comments
   */
  static async getForPost(postId) {
    const results = await db.query(
      `SELECT 
      comment.txt_content AS "txtContent", 
      comment.comment_id AS "commentId",
      comment.post_id AS "postId",
      comment.date_commented AS "dateCommented",
      users.user_id AS "userId",
      users.image_url AS "profileImgUrl",
      users.username
    FROM comment
    JOIN users ON comment.user_id = users.user_id
    WHERE comment.post_id = $1
    ORDER BY comment.date_commented ASC
    `,
      [postId]
    );

    const comments = results.rows;

    if (!comments)
      throw new NotFoundError(`Error getting comments for post_id: ${postId}`);

    return comments;
  }

  /**
   * Retrieve a Comment by ID
   *
   * @param {number} commentId - ID of the comment to retrieve
   *
   * @returns {Promise<Comment>} - A comment object containing the text content, ID of the user who created the comment, ID of the post where the comment is located, and the date when the comment was created.
   *
   * @throws {NotFoundError} - If no comment with the specified commentId is found.
   */

  static async getById(commentId) {
    const result = await db.query(
      `SELECT comment_id AS "commentId", user_id AS userId, txt_content AS "txtContent", post_id AS "postId", date_commented AS "dateCommented"
          FROM comment
          WHERE comment_id = $1
          `,
      [commentId]
    );
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`Comment ${commentId} not found`);

    return comment;
  }
}

module.exports = Comment;
