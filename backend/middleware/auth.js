"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError, BadRequestError } = require("../expressError");
const User = require("../models/user");
const Post = require("../models/post");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

// function ensureCorrectUser(req, res, next) {
//   try {
//     const user = res.locals.user;
//     console.log("USER: ", user);
//     if (!(user && user.username === req.params.username)) {
//       throw new UnauthorizedError();
//     }
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// }

async function ensureCorrectUser(req, res, next) {
  try {
    const userId = parseInt(req.params.userId) || parseInt(req.body.userId);
    const postId = parseInt(req.params.postId) || parseInt(req.body.postId);
    const username = req.params.username || req.body.username;
    const currUser = res.locals.user;

    console.log("userID: ", userId);
    console.log("postID: ", postId);
    console.log("username: ", username);
    console.log("currentUser: ", currUser.username);

    if (username) {
      if (!(currUser && currUser.username == username)) {
        throw new UnauthorizedError();
      }
    } else if (userId) {
      const fetchedUser = await User.getById(userId);
      if (fetchedUser.username !== currUser.username) {
        throw new UnauthorizedError();
      }
    } else if (postId) {
      const post = await Post.get(postId);
      if (post.userId !== currUser.id) {
        throw new UnauthorizedError();
      }
    } else {
      throw new BadRequestError();
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
