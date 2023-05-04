"use strict";

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for users */
class User {
  /**
   * Authenticate user with username and password
   *
   * @param {string} username - The username of the user to authenticate
   * @param {string} password - The password of the user to authenticate
   * @returns {Promise < {username, first name, last name, email, image URL}}
   * @throws {UnauthorizedError} - If user is not found or if the provided password is incorrect
   */

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT user_id AS "userId",
                  username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  image_url AS "imageUrl"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Create a new user in the system
   *
   * @param {Object} userData - An object containing user data
   * @param {string} userData.username - The username for the new user
   * @param {string} userData.password - The password for the new user
   * @param {string} userData.firstName - The first name for the new user
   * @param {string} userData.lastName - The last name for the new user
   * @param {string} userData.email - The email for the new user
   * @param {string} userData.imageUrl - The profile image URL for the new user
   * @returns {Promise< {userId, username, firstName, lastName, email,  imageUrl}}
   * @throws {BadRequestError} - If a user with the same username already exists
   */

  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    imageUrl,
  }) {
    // Check if the user already exists in the database
    const duplicateCheck = await db.query(
      `SELECT username
            FROM users
            WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Insert the new user into the database
    const result = await db.query(
      `INSERT INTO users
              (
                username,
                  password,
                  first_name,
                  last_name,
                  email,
                  image_url)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING user_id AS "userId", username, first_name AS "firstName", last_name AS "lastName", email, image_url AS "imageUrl"`,
      [username, hashedPassword, firstName, lastName, email, imageUrl]
    );

    // Return the newly created user
    const user = result.rows[0];
    return user;
  }

  /**
   * Retrieves user information by username
   *
   * @param {string} username - the username of the user to retrieve
   *
   * @returns {Promise< {userId: number, username: string, firstName: string, lastName: string, email: string, profileImage: string, dateJoined: Date, postCount: number, followersCount: number, followingCount: number}}
   *
   * @throws {NotFoundError} If the user is not found
   */

  static async get(username) {
    const userRes = await db.query(
      `SELECT user_id AS "userId",
              username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              image_url AS "profileImage",
              date_joined AS "dateJoined",
              (SELECT COUNT(*) FROM post WHERE user_id = users.user_id) AS "postCount",
              (SELECT COUNT(*) FROM follow WHERE followed_id = users.user_id) AS "followersCount",
              (SELECT COUNT(*) FROM follow WHERE follower_id = users.user_id) AS "followingCount"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /**
   * Get user by ID
   *
   * @param {number} userId - The ID of the user to retrieve
   *
   * @returns {Promise < {username: string, firstName: string, lastName: string, email: string, profileImage: string, dateJoined: Date}}
   *
   * @throws {NotFoundError} - If the user is not found
   */

  static async getById(userId) {
    // Find the user in the database using their username
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  image_url AS "profileImage",
                  date_joined AS "dateJoined"
          FROM users
          WHERE user_id = $1`,
      [userId]
    );

    // If no user is found, throw a NotFoundError
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${userId}`);

    return user;
  }

  /** Update a user's details
   * NOT USED YET ****
   */

  static async update(username, data) {
    // If the user is changing their password, hash the new password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    // Convert the property names in `data` to column names in the database
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      imgUrl: "image_url",
      email: "email",
    });

    // Use placeholders in the SQL query to prevent SQL injection attacks
    const usernameVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE users
                        SET ${setCols}
                        WHERE username = ${usernameVarIdx}
                        RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    image_url AS "imgUrl"`;

    // Execute the query and retrieve the updated user
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    // If no user is found, throw a NotFoundError
    if (!user) throw new NotFoundError(`No user: ${username}`);

    // Delete to prevent password being sent back to user
    delete user.password;

    return user;
  }

  /**
   * Retrieves user information by user ID.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise} user details - {username, first name, last name, email, profile image, date joined}
   * @throws {NotFoundError} If the user is not found in the database.
   */
  static async searchUsers(searchTerm) {
    // Search for users by username, first name, or last name

    const query = `
        SELECT user_id AS "userId", username, first_name AS "firstName",
               last_name AS "lastName", image_url AS "profileImage"
        FROM users
        WHERE username ILIKE $1
          OR first_name ILIKE $1
          OR last_name ILIKE $1
        ORDER BY (username ILIKE $1) DESC,
                 (first_name ILIKE $1) DESC,
                 (last_name ILIKE $1) DESC
      `;
    const result = await db.query(query, [`%${searchTerm}%`]);

    return result.rows;
  }
}

module.exports = User;
