"use strict";

const db = require("../db");

const Post = require("./post");
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

describe("create", function () {});

describe("getAll", function () {});

describe("getAllByUser", function () {});

describe("get", function () {});

describe("getLiked", function () {});

describe("update", function () {});

describe("delete", function () {});

describe("like", function () {});

describe("unlike", function () {});
