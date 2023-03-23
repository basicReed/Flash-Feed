const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Follow = require("../models/follows");
const { createToken } = require("../helpers/tokens");

// process.env.NODE_ENV === "test";

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testPostIds,
  testCommentIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /add", function () {
  test("Follow another user", async function () {
    const response = await request(app).post(`/follows/add`).send({
      followerId: testUserIds[2],
      followedId: testUserIds[1],
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.follow.followed_id).toBe(testUserIds[1]);
    expect(response.body.follow.follower_id).toBe(testUserIds[2]);
    //Check if follow
    const respCheck = await Follow.isFollowing(testUserIds[2], testUserIds[1]);
    expect(respCheck).toBe(true);
  });
});

describe("DELETE /remove", function () {
  test("Unfollow another user", async function () {
    const response = await request(app).delete(`/follows/remove`).send({
      followerId: testUserIds[1],
      followedId: testUserIds[0],
    });
    expect(response.statusCode).toBe(200);
    //Check if follow
    const respCheck = await Follow.isFollowing(testUserIds[1], testUserIds[0]);
    expect(respCheck).toBe(false);
  });
});

describe("GET /is-following", function () {
  test("Check if user follows another user: TRUE", async function () {
    const response = await request(app).get(`/follows/is-following`).send({
      followerId: testUserIds[1],
      followedId: testUserIds[0],
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.isFollowing).toBe(true);
  });

  test("Check if user follows another user: FALSE", async function () {
    const response = await request(app).get(`/follows/is-following`).send({
      followerId: testUserIds[1],
      followedId: testUserIds[2],
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.isFollowing).toBe(false);
  });
});

describe("GET /:userId/followed", function () {
  test("Gets all users the userId follows", async function () {
    const response = await request(app).get(
      `/follows/${testUserIds[1]}/followed`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.users[0].username).toBe("user1");
  });
});

describe("GET /:userId/followers", function () {
  test("Gets all followers for userId", async function () {
    const response = await request(app).get(
      `/follows/${testUserIds[0]}/followers`
    );

    expect(response.statusCode).toBe(200);

    expect(response.body.followers[0].username).toBe("user2");
  });
});
