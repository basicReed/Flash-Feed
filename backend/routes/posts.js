/** Routes for posts */

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const Post = require("../models/post");
const postGetLikedSchema = require("../schemas/postGetLiked.json");
const postGetByUserSchema = require("../schemas/postGetByUser.json");
const postGetAllSchema = require("../schemas/postGetAll.json");
const postGetSchema = require("../schemas/postGet.json");
const postCreateSchema = require("../schemas/postCreate.json");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

// GET /posts
// Returns list of all posts or posts from a specific user
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { user: userId, page: pageNum } = req.query;
    const posts = await Post.getAll(userId, pageNum);
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

//GET /posts/my-feed
// Returns list of all posts from users that are followed by current user
router.get(
  "/my-feed",
  // ensureLoggedIn,
  // ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { user: userId, page: pageNum } = req.query;
      const posts = await Post.getAllFromFollowed(userId, pageNum);
      return res.json({ posts });
    } catch (err) {
      return next(err);
    }
  }
);

// GET /posts/:id
// Returns details of a single post by ID
router.get("/:postId", ensureLoggedIn, async function (req, res, next) {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const post = await Post.get(userId, postId);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

// GET /posts/:id/liked
// Returns list of all users who liked a post by ID
router.get("/:userId/liked", ensureLoggedIn, async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const posts = await Post.getLiked(userId);

    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

// GET /posts/user/:username
// Returns list of all posts by a specific user by username
router.get("/user/:userId", ensureLoggedIn, async function (req, res, next) {
  try {
    const { userId } = req.params;

    // const validator = jsonschema.validate(req.body, postGetByUserSchema);
    // if (!validator.valid) {
    //   const errors = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errors);
    // }
    const posts = await Post.getAllByUser(userId);

    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});

// POST /posts
// Creates a new post
router.post(
  "/",
  ensureLoggedIn,
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, postCreateSchema);
      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errors);
      }
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const user = jwt.decode(token);

      const postData = { ...req.body, userId: user.userId };
      const post = await Post.create(postData);
      return res.status(201).json({ post });
    } catch (err) {
      return next(err);
    }
  }
);

// PATCH /posts/:id
// Updates a post by ID
router.patch(
  "/:postId",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
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
  }
);

// DELETE /posts/:id
// Deletes a post by ID
router.delete(
  "/:postId",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { postId } = req.params;

      await Post.delete(postId);
      return res.json({ deleted: postId });
    } catch (err) {
      return next(err);
    }
  }
);

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
router.post(
  "/like",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { postId, userId } = req.body;

      const like = await Post.likeOrUnlike(postId, userId);

      return res.json({ like });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/private",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { postId, userId } = req.body;

      const isPrivate = await Post.togglePrivacy(postId, userId);

      return res.json({ isPrivate });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Route for bookmarking a post
 *
 * POST /posts/:id/bookmark
 *
 * Request body: { userId }
 *
 * Authorization required: login
 *
 * Returns: { message: "Post bookmarked" }
 *
 * Errors:
 * - 401 if user is not logged in
 * - 404 if post not found
 */
router.post(
  "/bookmark",
  ensureLoggedIn,
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { userId, postId } = req.body;

      const bookmark = await Post.bookmark(userId, postId);
      return res.json({ bookmark });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = { router };
