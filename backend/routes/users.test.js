const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
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

describe("GET /users/:id", () => {
  test("Get a single user by ID", async () => {
    const response = await request(app).get(`/users/${testUserIds[0]}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe("user1");
  });

  test("Return 404 if user ID not found", async () => {
    const response = await request(app).get("/users/99999");
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /users/:username", () => {
  test("Get a single user by username", async () => {
    const response = await request(app).get(`/users/user2`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.username).toBe("user2");
  });

  test("Return 404 if username not found", async () => {
    const response = await request(app).get("/users/nonexistentuser");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /users", () => {
  test("Create a new user", async () => {
    const response = await request(app).post("/users").send({
      username: "newuser",
      password: "password",
      firstName: "New",
      lastName: "User",
      email: "newuser@example.com",
      imageUrl: "image.jpg",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.username).toBe("newuser");
  });

  test("Return 400 if missing required fields", async () => {
    const response = await request(app).post("/users").send({
      username: "newuser",
      password: "password",
      firstName: "New",
      lastName: "User",
    });
    expect(response.statusCode).toBe(400);
  });
});

//
describe("PATCH /users/:username", () => {
  test("Update a user's information", async () => {
    const token = createToken({ username: "user1" });
    const response = await request(app)
      .patch(`/users/user1`)
      .send({
        firstName: "Updated",
        lastName: "User",
        email: "user1@example.com",
        imgUrl: "hello.jpg",
      })
      .set("authorization", `Bearer ${token}`);
    console.log(response.body.user);
    expect(response.statusCode).toBe(200);
    expect(response.body.user.firstName).toBe("Updated");
  });

  //   test("Return 401 if user is not authenticated", async () => {
  //     const response = await request(app).patch(`/users/${testUserIds[0]}`).send({
  //       firstName: "Updated",
  //       lastName: "User",
  //       email: "user1@example.com",
  //     });
  //     expect(response.statusCode).toBe(401);
  //   });

  //   test("Return 404 if user ID not found", async () => {
  //     const token = createToken({ username: "user1" });
  //     const response = await request(app)
  //       .patch("/users/99999")
  //       .send({
  //         firstName: "Updated",
  //         lastName: "User",
  //         email: "user1@example.com",
  //       })
  //       .set("authorization", `Bearer ${token}`);
  //     expect(response.statusCode).toBe(404);
  //   });
});
