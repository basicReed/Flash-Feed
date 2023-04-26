-- Insert users
INSERT INTO users (username, first_name, last_name, email, password, image_url) VALUES 
    ('john_doe', 'John', 'Doe', 'john@example.com', 'password123', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRij6dtiHizH96qpCOe8WeXXP3yLyQJkPdGVg&usqp=CAU'),
    ('jane_doe', 'Jane', 'Doe', 'jane@example.com', 'password456', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_C0QoLfcntJnAuSBm52TShsByZ87m6w6j2g&usqp=CAU'),
    ('bob_smith', 'Bob', 'Smith', 'bob@example.com', 'password789', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHQv_th9wq3ivQ1CVk7UZRxhbPq64oQrg5Q&usqp=CAU'),
    ('alice_smith', 'Alice', 'Smith', 'alice@example.com', 'password321', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAX8p-KrjIxVpsOGeFKJZJR9OVa2tMXyQAlCxT7O-qFqKa242hbZLlOooixmQsvpievEg&usqp=CAU');

-- Insert posts
INSERT INTO post (user_id, txt_content,  is_private, date_posted) VALUES 
    (1, 'My first post!',  false, '2022-01-01 12:00:00'),
    (1, 'Heres another post',  false, '2022-01-02 12:00:00'),
    (2, 'Hello world!',  false, '2022-01-03 12:00:00'),
    (2, 'I love SQL', false, '2022-01-04 12:00:00'),
    (3, 'This is my first post',  false, '2022-01-05 10:00:00');


-- Insert likes
INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(2, 3),
(3, 1),
(3, 2),
(3, 3);

-- Insert comments
INSERT INTO comment (user_id, txt_content, post_id) VALUES
(1, 'Great post!', 1),
(2, 'Thanks for sharing!', 1),
(3, 'This is really helpful', 1),
(1, 'Wow, amazing picture!', 2),
(3, 'Looks like you had a great time', 2),
(1, 'Love this quote', 3),
(2, 'So true', 3),
(3, 'Inspiring!', 3),
(2, 'Beautiful scenery', 4),
(1, 'Where is this?', 4),
(3, 'I want to visit this place', 4),
(1, 'This is hilarious!', 5),
(2, 'Can''t stop laughing', 5),
(3, 'LOL', 5);

-- Insert follows
INSERT INTO follow (followed_id, follower_id)
VALUES 
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 1),
    (2, 3),
    (3, 1),
    (3, 2),
    (4, 1);