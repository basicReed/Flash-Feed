-----------------
-- FLASH FEED SQL
-----------------

-- Create User Profile Table
CREATE TABLE user_profile (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pass VARCHAR(100) NOT NULL,
    image_url VARCHAR(200)
);

-- Create Post Table
CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(user_id) NOT NULL,
    txt_content TEXT NOT NULL,
    img_url VARCHAR(200),
    is_private BOOLEAN DEFAULT false
);

-- Create Comment Table
CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(user_id) NOT NULL,
    txt_content TEXT NOT NULL
);

-- Create Comment to Post Relation Table
CREATE TABLE comment_to_post (
    comment_id INTEGER REFERENCES comment(comment_id),
    post_id INTEGER REFERENCES post(post_id),
    PRIMARY KEY (comment_id, post_id)
);

-- Create Likes Table
CREATE TABLE likes (
    post_id INTEGER REFERENCES post(post_id),
    user_id INTEGER REFERENCES user_profile(user_id),
    PRIMARY KEY (post_id, user_id)
);

-- Create Follow Table
CREATE TABLE follow (
followed_id INTEGER REFERENCES user_profile(user_id),
follower_id INTEGER REFERENCES user_profile(user_id),
PRIMARY KEY (followed_id, follower_id)
);

-- The above follow table creates a many-to-many relationship between users, where one user can follow multiple users, and one user can be followed by multiple users.




