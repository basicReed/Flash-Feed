const db = require("../db");
const { NotFoundError } = require("../expressError");
const User = require("./user");

/** Related functions for follows. */

class Follow {
  /** Create a follow relationship between a follower and someone they followed
   *
   * followerId: id of the user following
   * followedId: id of the user being followed
   *
   * Returns { follower_id, followed_id }
   * */

  static async add(followerId, followedId) {
    try {
      const results = await db.query(
        `INSERT INTO follow (follower_id, followed_id)
             VALUES ($1, $2)
             RETURNING follower_id, followed_id`,
        [followerId, followedId]
      );
      return results.rows[0];
    } catch (err) {
      throw new Error(`Error creating follow relationship: ${err.message}`);
    }
  }

  /** Remove a follow relationship between a follower and someone they followed
   *
   * followerId: id of the user following
   * followedId: id of the user being followed
   *
   * Returns true if successful.
   * Throws NotFoundError if the relationship does not exist.
   */

  static async remove(followerId, followedId) {
    const result = await db.query(
      `DELETE FROM follow
             WHERE follower_id = $1 AND followed_id = $2
             RETURNING follower_id, followed_id`,
      [followerId, followedId]
    );
    const follow = result.rows[0];

    if (!follow) throw new NotFoundError(`Follow relationship not found`);

    return true;
  }

  /** Check if a user is following another user
   *
   * followerId: id of the user following
   * followedId: id of the user being followed
   *
   * Returns true if they are following, false otherwise.
   */

  static async isFollowing(followerId, followedId) {
    const result = await db.query(
      `SELECT follower_id, followed_id
             FROM follow
             WHERE follower_id = $1 AND followed_id = $2`,
      [followerId, followedId]
    );
    return result.rows.length > 0;
  }

  /** Get all users a user is following
   *
   * userId: id of the user to find followed users for
   *
   * Returns [{ follower_id, followed_id, username }]
   */

  static async getFollowedUsers(userId) {
    //Check if user exist
    await User.getById(userId);

    const result = await db.query(
      `SELECT followed_id, username
             FROM follow
             JOIN users ON follow.followed_id = users.user_id
             WHERE follower_id = $1`,
      [userId]
    );
    if (!result.rows[0])
      throw new NotFoundError(`No users followed by userId: ${userId}`);

    return result.rows;
  }

  /** Get all users following a user
   *
   * userId: id of the user to find followers for
   *
   * Returns [{ follower_id, followed_id, username }]
   */

  static async getFollowers(userId) {
    // Check if user exist
    await User.getById(userId);

    const result = await db.query(
      `SELECT follower_id, username
             FROM follow
             JOIN users ON follow.follower_id = users.user_id
             WHERE followed_id = $1`,
      [userId]
    );
    if (!result.rows[0])
      throw new NotFoundError(`No users following userId: ${userId}`);

    return result.rows;
  }
}

module.exports = Follow;
