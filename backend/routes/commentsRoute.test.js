const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Comment = require("../models/comments");
const { NotFoundError } = require("../expressError");

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

describe("POST /create", function () {
  test("Create a post for user", async function () {
    const response = await request(app).post(`/comments/create`).send({
      postId: testPostIds[0],
      userId: testUserIds[2],
      txtContent: "Test comment string...",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.comment.txtContent).toBe("Test comment string...");
    expect(response.body.comment.commentId).toStrictEqual(expect.any(Number));
  });
});

describe("DELETE /:commentId", function () {
  test("Delete comment from post", async function () {
    const response = await request(app).delete(
      `/comments/${testCommentIds[0]}`
    );
    expect(response.statusCode).toBe(200);

    try {
      await Comment.getById(testCommentIds[0]);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });
});

describe("GET /post/:postId", function () {
  test("Get all comments for post", async function () {
    const response = await request(app).get(`/comments/post/${testPostIds[0]}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.comments[0].username).toBe("user1");
    expect(response.body.comments[0].txtContent).toBe("Test Comment 1");
    expect(response.body.comments.length).toBe(2);
  });
});
