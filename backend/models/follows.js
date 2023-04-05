const db = require("../db");
const { NotFoundError } = require("../expressError");
const User = require("./user");

/** Related functions for follows. */

class Follow {
  static async toggleFollow(followerUsername, followedUsername) {
    try {
      const follower = await db.query(
        `SELECT user_id FROM users WHERE username = $1`,
        [followerUsername]
      );
      const followed = await db.query(
        `SELECT user_id FROM users WHERE username = $1`,
        [followedUsername]
      );

      if (follower.rowCount === 0) {
        throw new NotFoundError(`Follower ${followerUsername} not found`);
      }
      if (followed.rowCount === 0) {
        throw new NotFoundError(`Followed ${followedUsername} not found`);
      }

      const followerId = follower.rows[0].user_id;
      const followedId = followed.rows[0].user_id;

      const existingFollow = await db.query(
        `SELECT * FROM follow WHERE follower_id = $1 AND followed_id = $2`,
        [followerId, followedId]
      );

      if (existingFollow.rowCount === 0) {
        const results = await db.query(
          `INSERT INTO follow (follower_id, followed_id)
             VALUES ($1, $2)
             RETURNING follower_id, followed_id`,
          [followerId, followedId]
        );
        return results.rows.length > 0;
      } else {
        const result = await db.query(
          `DELETE FROM follow
             WHERE follower_id = $1 AND followed_id = $2
             RETURNING follower_id, followed_id`,
          [followerId, followedId]
        );
        const follow = result.rows[0];
        if (!follow) {
          throw new NotFoundError(`Follow relationship not found`);
        }
        return false;
      }
    } catch (err) {
      throw new Error(`Error toggling follow relationship: ${err.message}`);
    }
  }

  /** Check if a user is following another user
   *
   * followerId: id of the user following
   * followedId: id of the user being followed
   *
   * Returns true if they are following, false otherwise.
   */

  static async isFollowing(followerUsername, followedUsername) {
    console.log(followerUsername, followedUsername);
    const result = await db.query(
      `SELECT follower_id, followed_id
       FROM follow f
       JOIN users u1 ON f.follower_id = u1.user_id
       JOIN users u2 ON f.followed_id = u2.user_id
       WHERE u1.username = $1 AND u2.username = $2`,
      [followerUsername, followedUsername]
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
      `SELECT users.user_id AS "userId", users.username, users.first_name AS "firstName", users.last_name AS "lastName", users.image_url AS "profileImage"
       FROM follow
       JOIN users ON follow.followed_id = users.user_id
       WHERE follower_id = $1`,
      [userId]
    );
    if (!result.rows[0]) {
      throw new NotFoundError(`No users followed by userId: ${userId}`);
    }

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
      `SELECT users.user_id AS "userId", users.username, users.first_name AS "firstName", users.last_name AS "lastName", users.image_url AS "profileImage"
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
