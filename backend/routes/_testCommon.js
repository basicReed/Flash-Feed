const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { createToken } = require("../helpers/tokens");

const testUserIds = [];
const testPostIds = [];
const testCommentIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM follow");
  await db.query("DELETE FROM comment");
  await db.query("DELETE FROM likes");
  await db.query("DELETE FROM post");
  await db.query("DELETE FROM users");

  const result = await db.query(`SELECT * FROM users`);

  //Generate unique user ids

  //Default password hashed
  const password = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

  // Input test users

  const resultsUsers = await db.query(
    `INSERT INTO users (username, first_name, last_name, email, password, image_url) VALUES 
        ('user1', 'Test', 'One', 'test1@example.com', $1, 'https://example.com/test1.png'),
        ('user2', 'Test', 'Two', 'test2@example.com', $1, 'https://example.com/test2.png'),
        ('user3', 'Test', 'Three', 'test3@example.com', $1, 'https://example.com/test3.png')
    RETURNING user_id;`,
    [password]
  );

  testUserIds.splice(0, 0, ...resultsUsers.rows.map((r) => r.user_id));

  const resultsPost = await db.query(
    `INSERT INTO post (user_id, txt_content) VALUES ($1, 'test post body')
    RETURNING post_id; `,
    [testUserIds[0]]
  );

  testPostIds.splice(0, 0, ...resultsPost.rows.map((r) => r.post_id));

  //Input test likes
  await db.query(
    `INSERT INTO likes (post_id, user_id) 
    VALUES
      ($1, $2);`,
    [testPostIds[0], testUserIds[1]]
  );

  //Input test follows
  await db.query(
    `INSERT INTO follow (followed_id, follower_id) 
    VALUES 
      ($1, $2);`,
    [testUserIds[0], testUserIds[1]]
  );

  //Input test comments (comment id set to prevent incrementing)

  const resultsComment = await db.query(
    `INSERT INTO comment ( user_id, txt_content, post_id) VALUES
    ($1, 'Test Comment 1', $2),
    ($3, 'Test Comment 2', $2)
    RETURNING comment_id;`,
    [testUserIds[0], testPostIds[0], testUserIds[1]]
  );

  testCommentIds.splice(0, 0, ...resultsComment.rows.map((r) => r.comment_id));
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

// Test tokens
// Call: res.locals.user.username
const u1Token = createToken({ username: "user1", userId: testUserIds[0] });
const u2Token = createToken({ username: "user2", userId: testUserIds[1] });
const u3Token = createToken({ username: "user3", userId: testUserIds[2] });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
  testUserIds,
  testPostIds,
  testCommentIds,
};
