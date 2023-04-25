-- Create User Profile Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    image_url VARCHAR(1000)
);

-- Create Post Table
CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    txt_content TEXT NOT NULL CHECK (length(txt_content) <= 1000),
    img_url VARCHAR(1000),
    is_private BOOLEAN DEFAULT false,
    date_posted TIMESTAMP DEFAULT clock_timestamp()
);


-- Create Comment Table
CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    txt_content TEXT NOT NULL,
    post_id INTEGER REFERENCES post(post_id) ON DELETE CASCADE,
    date_commented TIMESTAMP  DEFAULT clock_timestamp()
);


-- Create Likes Table
CREATE TABLE likes (
    post_id INTEGER REFERENCES post(post_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

-- Create Follow Table
CREATE TABLE follow (
followed_id INTEGER REFERENCES users(user_id),
follower_id INTEGER REFERENCES users(user_id),
PRIMARY KEY (followed_id, follower_id)
);

-- Create Bookmarks Table
CREATE TABLE bookmarks (
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    post_id INTEGER REFERENCES post(post_id) ON DELETE CASCADE,
    date_bookmarked TIMESTAMP  DEFAULT clock_timestamp(),
    PRIMARY KEY (user_id, post_id)
);
