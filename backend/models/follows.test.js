"use strict";

const db = require("../db");

const Follow = require("./follows");
const { NotFoundError } = require("../expressError");

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

describe("add", function () {
  test("works", async function () {
    const res = await Follow.add(1, 2);
    expect(res).toEqual({ follower_id: 1, followed_id: 2 });
    const result = await db.query(
      `SELECT *
             FROM follow
             WHERE follower_id = 1 AND followed_id = 2`
    );
    expect(result.rows).toEqual([{ follower_id: 1, followed_id: 2 }]);
  });
});

describe("remove", function () {
  test("works", async function () {
    const result = await Follow.remove(2, 1);
    expect(result).toEqual(true);
  });

  test("not found if user not following", async function () {
    try {
      await Follow.remove(1, 3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("isFollowing", function () {
  test("works", async function () {
    const res1 = await Follow.isFollowing(3, 1);
    expect(res1).toBe(false);
    const res2 = await Follow.isFollowing(2, 1);
    expect(res2).toBe(true);
  });
});

describe("getFollowedUsers", function () {
  test("works", async function () {
    const res = await Follow.getFollowedUsers(2);
    expect(res).toEqual([{ followed_id: 1, username: "user1" }]);
  });
});

describe("getFollowers", function () {
  test("works", async function () {
    const res = await Follow.getFollowers(1);
    expect(res).toEqual([{ follower_id: 2, username: "user2" }]);
  });

  test("not found if no user with that id is a follower", async function () {
    try {
      await Follow.getFollowers(3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
