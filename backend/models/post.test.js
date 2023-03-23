"use strict";

const db = require("../db");

const Post = require("./post");
const { NotFoundError, BadRequestError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testPostIds,
  testUserIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  test("works", async function () {
    const newPost = {
      userId: testUserIds[0],
      txtContent: "test post",
    };
    let post = await Post.create(newPost);
    expect(post).toEqual({
      post_id: expect.any(Number),
      user_id: newPost.userId,
      txtContent: newPost.txtContent,
      imgUrl: null,
      isPrivate: null,
      datePosted: expect.any(Date),
    });
    const result = await db.query(
      `SELECT post_id, user_id, txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"
            FROM post
            WHERE user_id = $1 AND txt_content = $2`,
      [newPost.userId, newPost.txtContent]
    );
    expect(result.rows).toEqual([post]);
  });
});

describe("getAll", function () {
  test("works", async function () {
    let posts = await Post.getAll();

    expect(posts).toEqual([
      {
        postId: testPostIds[0],
        userId: testUserIds[0],
        txtContent: "test post body",
        datePosted: expect.any(Date),
        username: "user1",
        numLikes: "1",
        numComments: "2",
        isPrivate: false,
        imgUrl: null,
        isLiked: false,
      },
    ]);
  });
});

describe("getAllByUser", function () {
  test("works", async function () {
    let posts = await Post.getAllByUser(testUserIds[0]);
    expect(posts).toEqual([
      {
        postId: testPostIds[0],
        userId: testUserIds[0],
        username: "user1",
        txtContent: "test post body",
        datePosted: expect.any(Date),
        imgUrl: null,
        isPrivate: false,
        isLiked: false,
        numLikes: "1",
        numComments: "2",
      },
    ]);
  });

  test("throws NotFoundError if user not found", async function () {
    try {
      await Post.getAllByUser(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("get", function () {
  test("works", async function () {
    let post = await Post.get(testPostIds[0]);
    expect(post).toEqual({
      postId: testPostIds[0],
      userId: testUserIds[0],
      username: "user1",
      txtContent: "test post body",
      datePosted: expect.any(Date),
      imgUrl: null,
      isLiked: false,
      isPrivate: false,
      numLikes: "1",
      numComments: "2",
    });
  });

  test("throws NotFoundError if not found", async function () {
    try {
      await Post.get(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("getLiked", function () {
  test("works", async function () {
    let posts = await Post.getLiked(testUserIds[1]);
    expect(posts).toEqual([
      {
        postId: testPostIds[0],
        userId: testUserIds[0],
        username: "user1",
        txtContent: "test post body",
        datePosted: expect.any(Date),
        imgUrl: null,
        isLiked: true,
        isPrivate: false,
        numLikes: "1",
        numComments: "2",
      },
    ]);
  });
});

describe("update", function () {
  test("works", async function () {
    const postId = testPostIds[0];
    const updateData = {
      txtContent: "updated test post body",
    };
    let post = await Post.update(postId, updateData);
    expect(post).toEqual({
      postId: postId,
      userId: testUserIds[0],
      txtContent: "updated test post body",
      imgUrl: null,
      isPrivate: false,
      datePosted: expect.any(Date),
    });

    const result = await db.query(
      `SELECT post_id, user_id, txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"
              FROM post
              WHERE post_id = $1`,
      [postId]
    );
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0]).toEqual({
      post_id: postId,
      user_id: testUserIds[0],
      txtContent: "updated test post body",
      imgUrl: null,
      isPrivate: false,
      datePosted: expect.any(Date),
    });
  });
});

describe("delete", function () {
  test("works", async function () {
    await Post.delete(testPostIds[0]);
    const result = await db.query(
      `SELECT post_id, user_id, txt_content AS "txtContent", img_url AS "imgUrl", is_private AS "isPrivate", date_posted AS "datePosted"
              FROM post
              WHERE post_id = $1`,
      [testPostIds[0]]
    );
    expect(result.rows.length).toEqual(0);
  });

  test("throws NotFoundError if not found", async function () {
    try {
      await Post.delete(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("like", function () {
  test("works", async function () {
    await Post.like(testPostIds[0], testUserIds[2]);
    const result = await db.query(
      `SELECT *
              FROM likes
              WHERE post_id = $1 AND user_id = $2`,
      [testPostIds[0], testUserIds[2]]
    );
    expect(result.rows.length).toEqual(1);
  });

  test("throws BadRequestError if already liked", async function () {
    try {
      await Post.like(testPostIds[0], testUserIds[1]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("unlike", function () {
  test("works", async function () {
    await Post.unlike(testPostIds[0], testUserIds[1]);
    const result = await db.query(
      `SELECT *

              FROM likes
              WHERE post_id = $1 AND user_id = $2`,
      [testPostIds[0], testUserIds[1]]
    );
    expect(result.rows.length).toEqual(0);
  });

  test("throws BadRequestError if not liked", async function () {
    try {
      await Post.unlike(testPostIds[0], testUserIds[2]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
