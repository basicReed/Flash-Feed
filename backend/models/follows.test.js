"use strict";

const db = require("../db");

const Follow = require("./follows");
const { NotFoundError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("add", function () {
  test("works", async function () {
    const res = await Follow.add(testUserIds[0], testUserIds[1]);
    expect(res).toEqual({
      follower_id: testUserIds[0],
      followed_id: testUserIds[1],
    });
    const result = await db.query(
      `SELECT *
             FROM follow
             WHERE follower_id = ${testUserIds[0]} AND followed_id = ${testUserIds[1]}`
    );
    expect(result.rows).toEqual([
      { follower_id: testUserIds[0], followed_id: testUserIds[1] },
    ]);
  });
});

describe("remove", function () {
  test("works", async function () {
    const result = await Follow.remove(testUserIds[1], testUserIds[0]);
    expect(result).toEqual(true);
  });

  test("not found if user not following", async function () {
    try {
      await Follow.remove(testUserIds[0], testUserIds[2]);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("isFollowing", function () {
  test("works", async function () {
    const res1 = await Follow.isFollowing(testUserIds[2], testUserIds[0]);
    expect(res1).toBe(false);
    const res2 = await Follow.isFollowing(testUserIds[1], testUserIds[0]);
    expect(res2).toBe(true);
  });
});

describe("getFollowedUsers", function () {
  test("works", async function () {
    const res = await Follow.getFollowedUsers(testUserIds[1]);
    expect(res).toEqual([{ followed_id: testUserIds[0], username: "user1" }]);
  });
});

describe("getFollowers", function () {
  test("works", async function () {
    const res = await Follow.getFollowers(testUserIds[0]);
    expect(res).toEqual([{ follower_id: testUserIds[1], username: "user2" }]);
  });

  test("not found if no user with that id is a follower", async function () {
    try {
      await Follow.getFollowers(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
