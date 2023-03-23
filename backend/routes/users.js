"use strict";

/** Routes for users */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
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
    console.log(validator.valid, validator.errors);
    console.log(req.params.username);

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

module.exports = { router };
