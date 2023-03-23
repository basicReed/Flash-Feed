"use strict";

/** Routes for comments */

const jsonschema = require("jsonschema");

const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Comment = require("../models/comments");
const { ensureLoggedIn } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");
const commentCreateSchema = require("../schemas/commentCreate.json");
const commentDeleteSchema = require("../schemas/commentDelete.json");
const commentGetForPostSchema = require("../schemas/commentGetForPost.json");

/** POST / comments/create
 */

router.post("/create", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentCreateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }
    const comment = await Comment.create(req.body);

    return res.json({ comment });
  } catch (err) {
    return next(err);
  }
});

/** DELETE / comments/:commentId
 *
 * Delete a comment by its ID.
 *
 * Returns { success: true }.
 *
 * Authorization required: logged in as the user who created the comment.
 */
router.delete("/:commentId", async function (req, res, next) {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.delete(commentId);

    return res.json({ comment });
  } catch (err) {
    return next(err);
  }
});

/** GET / comments/post/:postId
 *
 * Retrieve all comments for a post by its ID.
 *
 * Returns { comments: [{ txt_content, username }, ...] }.
 *
 * Authorization required: none.
 */
router.get("/post/:postId", async function (req, res, next) {
  try {
    const postId = req.params.postId;
    const comments = await Comment.getForPost(postId);

    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
