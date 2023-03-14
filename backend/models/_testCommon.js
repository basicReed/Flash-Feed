const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM follow");
  await db.query("DELETE FROM post");
  await db.query("DELETE FROM users");

  // Set constant user id's
  const Id1 = 1;
  const Id2 = 2;
  const Id3 = 3;

  //Default password hashed
  const password = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

  // Input test users
  await db.query(
    `INSERT INTO users (user_id, username, first_name, last_name, email, password, image_url) VALUES 
    ( $2,'user1', 'Test', 'One', 'test1@example.com', $1, 'https://example.com/test1.png'),
    ( $3, 'user2', 'Test', 'Two', 'test2@example.com', $1, 'https://example.com/test2.png'),
    ( $4, 'user3', 'Test', 'Three', 'test3@example.com', $1, 'https://example.com/test3.png')`,
    [password, Id1, Id2, Id3]
  );

  // const userId = userResult.rows[0].user_id;

  //Input test post (set post_id to prevent incrementing)
  await db.query(
    `INSERT INTO post (post_id, user_id, txt_content) VALUES (1, 1, 'test post body') `
  );

  //Input test likes
  await db.query(
    `INSERT INTO likes (post_id, user_id) 
    VALUES
      (1, 2);`
  );

  //Input test follows
  await db.query(
    `INSERT INTO follow (followed_id, follower_id) 
    VALUES 
      (1, 2);`
  );

  //Input test comments (comment id set to prevent incrementing)
  await db.query(
    `INSERT INTO comment (comment_id, user_id, txt_content, post_id) VALUES
    (1, 1, 'Test Comment 1', 1),
    (2, 2, 'Test Comment 2', 1);`
  );
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
