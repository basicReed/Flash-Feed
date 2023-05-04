const db = require("../db");
const { NotFoundError } = require("../expressError");
const User = require("./user");

/** Related functions for follows. */
class Follow {
  /**
   * Toggle Follow Relationship
   * @param {string} followerUsername - The username of the follower
   * @param {string} followedUsername - The username of the user being followed
   *
   * Toggles the follow relationship between the given follower and followed users.
   * If the follow relationship already exists, it is deleted and false is returned.
   * If it does not exist, it is created and true is returned.
   *
   * @returns {boolean} - True if follow relationship was created, false if it was deleted.
   *
   * @throws {NotFoundError} if either follower or followed user is not found.
   * @throws {Error} if there's any other error toggling the follow relationship.
   */
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

  /**
   * Check if a user is following another user
   *
   * @param {string} followerUsername - The username of the user who is following
   * @param {string} followedUsername - The username of the user being followed
   *
   * @returns {Promise<boolean>} - True if follower is following followed, false otherwise.
   */

  static async isFollowing(followerUsername, followedUsername) {
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

  /**
   * Get all users followed by a given user
   *
   * @param {number} userId - The ID of the user to find followed users for
   *
   * @returns {Promise<Array<{ userId: number, username: string, firstName: string, lastName: string, profileImage: string }>>}
   *      - An array of objects containing information about the followed users, including their user ID, username, first name, last name, and profile image URL
   *
   * @throws {NotFoundError} - If the user with the given ID does not exist or if there are no users followed by the given user
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

  /**
   * Get all users following a user.
   *
   * @param {number} userId - The ID of the user to find followers for.
   * @returns {Promise<Array<{ userId: number, username: string, firstName: string, lastName: string, profileImage: string }>>} - An array of objects representing users who follow the specified user, containing their user ID, username, first name, last name, and profile image URL.
   * @throws {NotFoundError} If no users are following the specified user.
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
