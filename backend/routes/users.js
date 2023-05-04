"use strict";

/** Routes for users */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const User = require("../models/user");
const Post = require("../models/post");

const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userSearchSchema = require("../schemas/userSearch.json");

const router = new express.Router();

/** GET /users/
 *
 * @returns {[{ ...user }, ...]}
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/**GET /users/search?q=searchTerm
 * Search for users by username, first name, or last name
 * @returns {[{ ...user }, ...]}
 *      - Ordered by closest matches first.
 */
router.get("/search", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.query, userSearchSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const { q } = req.query;
    const searchTerm = q;
    const users = await User.searchUsers(searchTerm);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /users/:idOrUsername
 * fetches user based on id or username
 */
router.get("/:idOrUsername", async function (req, res, next) {
  try {
    const param = req.params.idOrUsername;
    let user;

    if (/^\d+$/.test(param)) {
      // check if the parameter is an integer
      user = await User.getById(param);
    } else {
      // assume the parameter is a username string
      user = await User.get(param);
    }

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// POST /users/
// Create a new user
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

// Update a user by ID
router.patch(
  "/:username",
  ensureLoggedIn,
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);

      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errors);
      }
      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Route for getting bookmarked posts by user ID
 *
 * GET /posts/user/:userId/bookmarked
 *
 * Authorization required: login
 *
 * @returns {[...post, ...]}
 *
 * Errors:
 * - 401 if user is not logged in
 * - 404 if user not found
 */
router.get(
  "/:userId/bookmarked",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { userId } = req.params;

      const posts = await Post.getBookmarked(userId);
      return res.json({ posts });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = { router };
