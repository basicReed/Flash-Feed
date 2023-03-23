/** Routes for posts */

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Post = require("../models/post");
const postGetLikedSchema = require("../schemas/postGetLiked.json");
const postGetByUserSchema = require("../schemas/postGetByUser.json");
const postGetAllSchema = require("../schemas/postGetAll.json");
const postGetSchema = require("../schemas/postGet.json");
const postCreateSchema = require("../schemas/postCreate.json");

// GET /posts
// Returns list of all posts
router.get("/", async function (req, res, next) {
  try {
    const posts = await Post.getAll();
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

// GET /posts/:id
// Returns details of a single post by ID
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const post = await Post.get(id);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

// GET /posts/:id/liked
// Returns list of all users who liked a post by ID
router.get("/:userId/liked", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const liked = await Post.getLiked(userId);
    return res.json({ liked });
  } catch (err) {
    return next(err);
  }
});

// GET /posts/user/:username
// Returns list of all posts by a specific user by username
router.get("/user/:username", async function (req, res, next) {
  try {
    const { username } = req.params;
    const validator = jsonschema.validate(req.body, postGetByUserSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const posts = await Post.getByUser(username);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

// POST /posts
// Creates a new post
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, postCreateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const post = await Post.create(req.body);
    return res.status(201).json({ post });
  } catch (err) {
    return next(err);
  }
});

// PATCH /posts/:id
// Updates a post by ID
router.patch("/:postId", async function (req, res, next) {
  try {
    const { postId } = req.params;
    const validator = jsonschema.validate(req.body, postGetSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const post = await Post.update(postId, req.body);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

// DELETE /posts/:id
// Deletes a post by ID
router.delete("/:id", async function (req, res, next) {
  try {
    const postId = parseInt(req.params.id);

    await Post.delete(postId);
    return res.json({ deleted: postId });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route for liking a post
 *
 * POST /posts/:id/like
 *
 * Request body: {}
 *
 * Authorization required: login
 *
 * Returns: {message: "Post liked"}
 *
 * Errors:
 * - 401 if user is not logged in
 * - 404 if post not found
 */
router.post("/like", async function (req, res, next) {
  try {
    const { postId, userId } = req.body;

    await Post.like(postId, userId);

    return res.json({ message: "Post liked" });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route for unliking a post
 *
 * POST /posts/:id/unlike
 *
 * Request body: {}
 *
 * Authorization required: login
 *
 * Returns: {message: "Post unliked"}
 *
 * Errors:
 * - 401 if user is not logged in
 * - 404 if post not found
 */
router.post("/unlike", async function (req, res, next) {
  try {
    const { postId, userId } = req.body;

    await Post.unlike(postId, userId);

    return res.json({ message: "Post unliked" });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
