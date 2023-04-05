"use strict";

/** Routes for users */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Post = require("../models/post");

const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = new express.Router();

// Get all users
router.get("/", async function (req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

// Search for users by username, first name, or last name
// GET /users/search?query=searchTerm
// Returns [{ userId, username, firstName, lastName, imageUrl }, ...]
// Ordered by closest matches first.

router.get("/search", async function (req, res, next) {
  try {
    const { q } = req.query;
    console.log("SEARCH 2: ", q);
    const searchTerm = q;
    const users = await User.searchUsers(searchTerm);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

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
router.patch("/:username", async function (req, res, next) {
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
});

/**
 * Route for getting bookmarked posts by user ID
 *
 * GET /posts/user/:userId/bookmarked
 *
 * Authorization required: login
 *
 * Returns: {posts: [{id, title, body, userId, bookmarked}]}
 *
 * Errors:
 * - 401 if user is not logged in
 * - 404 if user not found
 */
router.get("/:userId/bookmarked", async function (req, res, next) {
  try {
    const { userId } = req.params;

    const posts = await Post.getBookmarked(userId);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
