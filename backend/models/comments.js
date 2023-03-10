"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for comments */

class Comment {
  /** Create a Comment
   *
   * post_id: id of post where comment is located
   * user_id: id of user commenting
   * content: string txt body of comment
   *
   * Returns {Promise<Object>} with new id of comment
   *
   * Throws error if there's an error creating the comment
   */

  static async create(post_id, user_id, content) {
    try {
      // create comment
      const results = await db.query(
        `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
        [post_id, user_id, content]
      );

      const comment_id = results.rows[0].id;
      // create a comment -> post relation
      const postRelation = await db.query(
        `INSERT INTO comment_to_post (comment_id, post_id) 
    VALUES ($1, $2)`,
        [comment_id, post_id]
      );

      return postRelation;
    } catch (err) {
      throw new Error(`Error creating comment: ${err.message}`);
    }
  }

  /** Delete a Comment
   *
   * id: ID of the comment to delete
   *
   * Returns true if successful.
   *
   * Throws NotFoundError if comment not found.
   */

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM comments
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`Comment ${id} not found`);

    return true;
  }

  /** Get All Comments For a Post
   *
   * post_id: ID of the post for which to retrieve comments
   *
   * Returns {Promise<Array>} - An array of comment objects containing the text content and username of the user who created each comment
   *
   * Throws error if there's an error retrieving the comments
   */
  static async getForPost(id) {
    try {
      const results = await db.query(
        `SELECT comment.txt_content, user_profile.username
            FROM comment
            JOIN user_profile ON comment.user_id = user_profile.user_id
            JOIN comment_to_post ON comment.comment_id = comment_to_post.comment_id
            JOIN post ON comment_to_post.post_id = post.post_id
            WHERE post.post_id = $1`,
        [id]
      );

      return results;
    } catch (err) {
      throw new Error(`Error getting comments for post: ${err.message}`);
    }
  }
}

module.exports = Comment;
