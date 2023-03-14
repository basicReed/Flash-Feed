"use strict";

const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db");
const User = require("./user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Register a new user */
describe("register", function () {
  test("register a new user", async function () {
    const newUser = await User.register({
      username: "testuser",
      password: "password1",
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      imageUrl: "https://example.com/testuser.png",
    });
    expect(newUser).toEqual({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      imageUrl: "https://example.com/testuser.png",
    });

    const result = await db.query(`
        SELECT username, first_name AS "firstName", last_name AS "lastName", email, image_url AS "imageUrl"
        FROM users
        WHERE username = 'testuser'
      `);
    expect(result.rows).toEqual([
      {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        imageUrl: "https://example.com/testuser.png",
      },
    ]);
  });

  test("throw BadRequestError if user already exists", async function () {
    try {
      await User.register({
        username: "user1",
        password: "password",
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        imageUrl: "https://example.com/testuser.png",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** Get user by ID */
describe("get", function () {
  test("get user by username", async function () {
    const user = await User.get("user1");
    console.log("PRINT: ", user);
    expect(user).toEqual({
      username: "user1",
      firstName: "Test",
      lastName: "One",
      email: "test1@example.com",
      imageUrl: "https://example.com/test1.png",
    });
  });

  test("throw NotFoundError if user not found", async function () {
    try {
      await User.get(100);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** Update user data */
describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
  };

  test("works", async function () {
    let job = await User.update("user1", updateData);
    expect(job).toEqual({
      username: "user1",
      firstName: "NewF",
      lastName: "NewF",
      email: "test1@example.com",
      imgUrl: "https://example.com/test1.png",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "tester",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
