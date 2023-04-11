const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Follow = require("../models/follows");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
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

router.post(
  "/toggle",
  ensureLoggedIn,
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      // const validator = jsonschema.validate(req.body, followAddSchema);
      // if (!validator.valid) {
      //   const errors = validator.errors.map((e) => e.stack);
      //   throw new BadRequestError(errors);
      // }

      const { username, followedUsername } = req.body;

      const follow = await Follow.toggleFollow(username, followedUsername);
      return res.json({ follow });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /follows/is-following
 *
 * Check if the logged-in user is following the given user and returns true or false
 *
 * Authorization required: logged in user
 */

router.get("/is-following", ensureLoggedIn, async function (req, res, next) {
  // const validator = jsonschema.validate(req.body, followIsFollowingSchema);
  // if (!validator.valid) {
  //   const errors = validator.errors.map((e) => e.stack);
  //   throw new BadRequestError(errors);
  // }

  try {
    const { followerUsername, followedUsername } = req.query; // Extract variables from query string
    const isFollowing = await Follow.isFollowing(
      followerUsername,
      followedUsername
    );
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

router.get("/:id/followed", ensureLoggedIn, async function (req, res, next) {
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

router.get("/:id/followers", ensureLoggedIn, async function (req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    const users = await Follow.getFollowers(userId);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

module.exports = { router };
