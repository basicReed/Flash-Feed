"use strict";

/** Routes for comments */

const jsonschema = require("jsonschema");

const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Comment = require("../models/comments");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");
const commentCreateSchema = require("../schemas/commentCreate.json");
const commentDeleteSchema = require("../schemas/commentDelete.json");
const commentGetForPostSchema = require("../schemas/commentGetForPost.json");

/** POST /comments/create
 * CREATE a new comment for a post
 *
 * @param {string} postId - The id of the post the comment belongs to
 * @param {string} userId - The id of the user creating the comment
 * @param {string} txtContent - The text content of the comment
 * @returns {object} An object containing the new comment details
 * @throws {BadRequestError} If the request body does not pass validation
 */

router.post(
  "/create",
  ensureLoggedIn,
  ensureCorrectUser,
  async function (req, res, next) {
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
  }
);

/** DELETE /comments/:commentId
 *
 * Delete a comment by its ID.
 *
 * NOT USED YET****
 */
router.delete(
  "/:commentId",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.delete(commentId);

      return res.json({ comment });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * GET /comments/post/:postId
 *
 * Retrieve all comments for a post by its ID.
 *
 * @param {string} postId - ID of the post
 *
 * @returns {Object} - Object containing an array of comments
 *                      [{ txt_content, username }, ...]
 *
 * @throws {NotFoundError} - If the post is not found
 */
router.get("/post/:postId", ensureLoggedIn, async function (req, res, next) {
  try {
    const postId = req.params.postId;
    const comments = await Comment.getForPost(postId);

    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
