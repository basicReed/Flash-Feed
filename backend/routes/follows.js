const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Follow = require("../models/follows");
const { ensureLoggedIn } = require("../middleware/auth");
const followAddSchema = require("../schemas/followAdd.json");
const followFollowedUsersSchema = require("../schemas/followFollowedUsers.json");
const followGetFollowersSchema = require("../schemas/followGetFollowers.json");
const followIsFollowingSchema = require("../schemas/followIsFollowing.json");
const followRemoveSchema = require("../schemas/followRemove.json");

/** POST / follows/add
 *  { follower_id, followed_id } => { follower_id, followed_id }
 *
 * Adds a follow relationship between a follower and someone they followed
 * and returns the relationship.
 *
 * Authorization required: logged in user
 */

router.post("/add", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, followAddSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }

    const { followerId, followedId } = req.body;
    // if (req.user.id !== followerId) {
    //   throw new BadRequestError("Logged in user does not match follower_id");
    // }

    const follow = await Follow.add(followerId, followedId);
    return res.json({ follow });
  } catch (err) {
    return next(err);
  }
});

router.delete("/remove", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, followRemoveSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }

    const { followerId, followedId } = req.body;
    const result = await Follow.remove(followerId, followedId);
    return res.json({ deleted: result });
  } catch (err) {
    return next(err);
  }
});

/** GET /follows/is-following
 *
 * Check if the logged-in user is following the given user and returns true or false
 *
 * Authorization required: logged in user
 */

router.get("/is-following", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, followIsFollowingSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errors);
    }

    const { followerId, followedId } = req.body;

    const isFollowing = await Follow.isFollowing(followerId, followedId);

    return res.json({ isFollowing });
  } catch (err) {
    return next(err);
  }
});

/** GET / follows/[userId]/followed/
 *
 * Get all users followed by userId
 *
 * Returns {followers: [{ follower_id, followed_id, username }] }
 *
 * Authorization required: logged in user
 */

router.get("/:id/followed", async function (req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    const users = await Follow.getFollowedUsers(userId);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET / follows/[userId]/followers/
 *
 * Get all users following a user by userId
 *
 * Returns {followers: [{ followed_id, username }] }
 *
 * Authorization required: logged in user
 */

router.get("/:id/followers", async function (req, res, next) {
  try {
    const userId = Number(req.params.id);
    const followers = await Follow.getFollowers(userId);
    return res.json({ followers });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
