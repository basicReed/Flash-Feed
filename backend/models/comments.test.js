"use strict";

const db = require("../db");

const Comment = require("./comments");
const { NotFoundError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testCommentIds,
  testUserIds,
  testPostIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Create a comment */
describe("create", function () {
  test("works", async function () {
    const newComment = await Comment.create(
      testPostIds[0],
      testUserIds[1],
      "Test comment"
    );
    expect(newComment).toEqual(expect.any(Object));
    expect(newComment.commentid).toEqual(expect.any(Number));
    expect(newComment.userid).toEqual(testUserIds[1]);
  });
});

/* Delete a comment */
describe("delete", function () {
  test("works", async function () {
    const result = await Comment.delete(testCommentIds[0]);
    expect(result).toEqual(true);
    // Confirm comment has been deleted by trying to fetch it
    const res = await db.query(
      `SELECT * FROM comment WHERE comment_id = ${testUserIds[0]}`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such comment", async function () {
    try {
      await Comment.delete(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/* Get all comments for a post */
describe("getForPost", function () {
  test("works", async function () {
    const comments = await Comment.getForPost(testPostIds[0]);
    expect(comments).toEqual(expect.any(Array));
    expect(comments.length).toEqual(2);
    expect(comments[0].txt_content).toEqual("Test Comment 1");
    expect(comments[0].username).toEqual("user1");
    expect(comments[1].txt_content).toEqual("Test Comment 2");
    expect(comments[1].username).toEqual("user2");
  });

  test("not found if no such post", async function () {
    try {
      await Comment.getForPost(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
