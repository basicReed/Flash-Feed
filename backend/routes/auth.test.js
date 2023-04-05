"use strict";

const request = require("supertest");

const app = require("../app");

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

describe("POST /auth/token", function () {
  test("works", async function () {
    const response = await request(app)
      .post("/auth/token")
      .send({ username: "user1", password: "password" });
    expect(response.body).toEqual({ token: expect.any(String) });
  });

  test("unauth with wrong password", async function () {
    const response = await request(app).post("/auth/token").send({
      username: "user1",
      password: "nope",
    });

    expect(response.statusCode).toEqual(401);
  });

  test("unauth with wrong user", async function () {
    const response = await request(app)
      .post("/auth/token")
      .send({ username: "fakeuser", password: "passord" });
    expect(response.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "user1",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: 42,
      password: "cant-use-integers",
    });
    expect(resp.statusCode).toEqual(400);
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
    expect(response.body).toEqual({
      user: {
        userId: expect.any(Number),
        username: "newuser",
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        imageUrl: "image.jpg",
      },
      token: expect.any(String),
    });
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
