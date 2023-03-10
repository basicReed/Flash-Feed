const db = require("../db");
const { NotFoundError } = require("../expressError");

class Like {
  /** Add a like to a post
   *
   * postId: ID of the post to like
   * userId: ID of the user liking the post
   *
   * Returns true if successful.
   * Throws NotFoundError if the post or user is not found.
   */
  static async add(postId, userId) {
    const postRes = await db.query(
      `SELECT post_id
       FROM post
       WHERE post_id = $1`,
      [postId]
    );
    const post = postRes.rows[0];
    if (!post) throw new NotFoundError(`Post ${postId} not found`);

    const userRes = await db.query(
      `SELECT user_id
       FROM user_profile
       WHERE user_id = $1`,
      [userId]
    );
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`User ${userId} not found`);

    const res = await db.query(
      `INSERT INTO likes (post_id, user_id)
       VALUES ($1, $2)
       RETURNING post_id`,
      [postId, userId]
    );
    return true;
  }

  /** Remove a like from a post
   *
   * postId: ID of the post to remove the like from
   * userId: ID of the user whose like to remove
   *
   * Returns true if successful.
   * Throws NotFoundError if the post or user is not found.
   */
  static async remove(postId, userId) {
    const postRes = await db.query(
      `SELECT post_id
       FROM post
       WHERE post_id = $1`,
      [postId]
    );
    const post = postRes.rows[0];
    if (!post) throw new NotFoundError(`Post ${postId} not found`);

    const userRes = await db.query(
      `SELECT user_id
       FROM user_profile
       WHERE user_id = $1`,
      [userId]
    );
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`User ${userId} not found`);

    const res = await db.query(
      `DELETE FROM likes
       WHERE post_id = $1 AND user_id = $2
       RETURNING post_id`,
      [postId, userId]
    );
    if (!res.rows[0]) throw new NotFoundError(`Like not found`);
    return true;
  }

  /** Check if a post is liked by a user
   *
   * postId: ID of the post to check
   * userId: ID of the user to check
   *
   * Returns true if the post is liked by the user, false otherwise.
   */
  static async isLikedByUser(postId, userId) {
    const res = await db.query(
      `SELECT EXISTS (
         SELECT 1
         FROM likes
         WHERE post_id = $1 AND user_id = $2
       ) AS is_liked`,
      [postId, userId]
    );
    return res.rows[0].is_liked;
  }
}

module.exports = Like;
