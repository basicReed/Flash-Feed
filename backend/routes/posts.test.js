const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Post = require("../models/post");
const { createToken } = require("../helpers/tokens");

// process.env.NODE_ENV === "test"

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

describe("GET /posts", function () {
  test("Get all public posts", async function () {
    const response = await request(app).get(`/posts`);
    expect(response.statusCode).toBe(200);
    expect(response.body.posts[0].username).toBe("user1");
    expect(response.body.posts[0].txtContent).toBe("test post body");
  });
});

describe("GET /posts/:id", function () {
  test("Get a single post by ID", async function () {
    const response = await request(app).get(`/posts/${testPostIds[0]}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.post.username).toBe("user1");
    expect(response.body.post.txtContent).toBe("test post body");
  });
});

describe("GET /posts/:userId/liked", function () {
  test("Get all liked post by user", async function () {
    const response = await request(app).get(`/posts/${testUserIds[1]}/liked`);
    expect(response.statusCode).toBe(200);
    expect(response.body.liked[0].username).toBe("user1");
  });
});

describe("POST /posts", function () {
  test("POST a post for user", async function () {
    const response = await request(app).post(`/posts`).send({
      userId: testUserIds[1],
      txtContent: "New post string",
      isPrivate: false,
    });
    expect(response.statusCode).toBe(201);

    expect(response.body.post.imgUrl).toBe(null);
    expect(response.body.post.txtContent).toBe("New post string");
    expect(response.body.post.user_id).toBe(testUserIds[1]);
  });
});

describe("PATCH /posts/:id", function () {
  test("PATCH a single post by user", async function () {
    const response = await request(app).patch(`/posts/${testPostIds[0]}`).send({
      postId: testPostIds[0],
      txtContent: "Updated string",
      imgUrl: "updated.jpg",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.post.txtContent).toBe("Updated string");
    expect(response.body.post.imgUrl).toBe("updated.jpg");
  });
});

describe("DELETE /posts/:id", function () {
  test("DELETE a single post by user", async function () {
    const response = await request(app).delete(`/posts/${testPostIds[0]}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBe(testPostIds[0]);

    const respGet = await request(app).get(`/posts/${testPostIds[0]}`);
    expect(respGet.statusCode).toBe(404);
  });
});

describe("POST /posts/like", function () {
  test("LIKE a post from a user", async function () {
    const response = await request(app).post("/posts/like").send({
      postId: testPostIds[0],
      userId: testUserIds[2],
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Post liked");

    // Check if post is found in likes by testUser
    const responseLikes = await request(app).get(
      `/posts/${testUserIds[2]}/liked`
    );
    expect(responseLikes.statusCode).toBe(200);
    expect(responseLikes.body.liked[0].username).toBe("user1");
  });
});

describe("POST /posts/unlike", function () {
  test("UNLIKE a post from a user", async function () {
    const response = await request(app).post("/posts/unlike").send({
      postId: testPostIds[0],
      userId: testUserIds[1],
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Post unliked");

    // Check if post is found in likes by testUser
    const responseLikes = await request(app).get(
      `/posts/${testUserIds[1]}/liked`
    );
    expect(responseLikes.statusCode).toBe(200);
    expect(responseLikes.body.liked.length).toBe(0);
  });
});
