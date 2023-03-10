-- Insert 10 fake users with creative usernames
INSERT INTO user_profile (username, first_name, last_name, email, pass, image_url) VALUES
('tiger_lily', 'Lily', 'Wang', 'lilywang@example.com', 'hashed_password', 'https://example.com/tiger_lily.jpg'),
('coding_ninja', 'Emma', 'Davis', 'emmadavis@example.com', 'hashed_password', 'https://example.com/coding_ninja.jpg'),
('coffee_lover', 'Oliver', 'Jones', 'oliverjones@example.com', 'hashed_password', 'https://example.com/coffee_lover.jpg'),
('bookworm', 'Mia', 'Johnson', 'miajohnson@example.com', 'hashed_password', 'https://example.com/bookworm.jpg'),
('foodie', 'Aiden', 'Lee', 'aidenlee@example.com', 'hashed_password', 'https://example.com/foodie.jpg'),
('travel_bug', 'Sophie', 'Brown', 'sophiebrown@example.com', 'hashed_password', 'https://example.com/travel_bug.jpg'),
('yoga_guru', 'Lucas', 'Kim', 'lucaskim@example.com', 'hashed_password', 'https://example.com/yoga_guru.jpg'),
('music_fanatic', 'Mila', 'Garcia', 'milagarcia@example.com', 'hashed_password', 'https://example.com/music_fanatic.jpg'),
('outdoor_adventurer', 'Noah', 'Smith', 'noahsmith@example.com', 'hashed_password', 'https://example.com/outdoor_adventurer.jpg'),
('fashionista', 'Chloe', 'Taylor', 'chloetaylor@example.com', 'hashed_password', 'https://example.com/fashionista.jpg');

-- Insert 10 fake posts from those users
INSERT INTO post (user_id, txt_content, img_url, is_private) VALUES
(1, 'Enjoying the sunshine today ☀️', 'https://example.com/post1.jpg', false),
(1, 'Feeling grateful for this beautiful view 🌅', 'https://example.com/post2.jpg', false),
(2, 'Another day, another code 💻', 'https://example.com/post3.jpg', false),
(2, 'Work in progress 🚧', 'https://example.com/post4.jpg', true),
(3, 'Nothing like a cup of coffee in the morning ☕', NULL, false),
(3, 'Delicious brunch with friends 🍳', 'https://example.com/post5.jpg', false),
(4, 'Lost in a good book 📚', NULL, false),
(4, 'Throwback to my favorite childhood book 🐰', 'https://example.com/post6.jpg', false),
(5, 'Trying out new restaurants is my favorite hobby 🍽️', 'https://example.com/post7.jpg', false),
(5, 'Life is better with good food and good friends ❤️', 'https://example.com/post8.jpg', false);

-- Insert random follows
INSERT INTO follow (followed_id, follower_id) VALUES
(2, 1),
(3, 1),
(3, 2),
(4, 2),
(4, 3),
(5, 3),
(5, 4),
(6, 4),
(6, 5),
(7, 5),
(7, 6),
(8, 6),
(8, 7),
(9, 7),
(9, 8),
(10, 8),
(10, 9);

-- Insert random likes
INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(1, 4),
(2, 3),
(2, 5),
(3, 1),
(4, 3),
(5, 4),
(5, 6),
(6, 1),
(7, 2),
(7, 3),
(8, 4);

-- Insert comments
INSERT INTO comment (user_id, txt_content) VALUES
(1, 'Beautiful picture!'),
(2, 'I wish I could be there too.'),
(3, 'Looks delicious!'),
(4, 'What book are you reading?'),
(5, 'I love this restaurant!'),
(6, 'Great outfit!'),
(7, 'Amazing view!'),
(8, 'You look so relaxed!'),
(9, 'I need to try this recipe!'),
(10, 'Love your hair!');

-- Insert comment to post relations
INSERT INTO comment_to_post (comment_id, post_id) VALUES
(1, 1),
(2, 1),
(3, 5),
(4, 4),
(5, 7),
(6, 4),
(7, 2),
(8, 1),
(9, 5),
(10, 8);