"use strict";

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
/** Related functions for users */

class User {
  /** Create a user
   *
   *  data should be {}
   *
   * Returns {} containing user details
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
              (username,
                  password,
                  first_name,
                  last_name,
                  email,
                  image_url)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING username, first_name AS "firstName", last_name AS "lastName", email, image_url AS "imageUrl"`,
      [username, hashedPassword, firstName, lastName, email, imageUrl]
    );

    // Return the newly created user
    const user = result.rows[0];
    return user;
  }

  /** Get a user by username
   *
   * Returns { } containing user details
   */

  static async get(username) {
    // Find the user in the database using their username
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  image_url AS "imageUrl"
          FROM users
          WHERE username = $1`,
      [username]
    );

    // If no user is found, throw a NotFoundError
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Get user by id
   *
   * Returns {} containing user details
   */

  static async getById(userId) {
    // Find the user in the database using their username
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  image_url AS "imageUrl"
          FROM users
          WHERE user_id = $1`,
      [userId]
    );

    // If no user is found, throw a NotFoundError
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update a user's details
   *
   * Returns { } containing updated user details
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
}

module.exports = User;
