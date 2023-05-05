# Flash Feed

This is the ReactJS frontend & Node.js/Express backend for Flash Feed, version 1.

Live Demo: [FLASH FEED](https://jordans-flashfeed-app.surge.sh/home)

<img width="1405" alt="MyGrub Home" src="https://user-images.githubusercontent.com/109553225/235498993-7b0aedb2-b625-4d83-9252-c1a3491c2168.png">
_CURRENTLY UNDER DEVELOPMENT_

## Description

Is Flash Feed is a Twitter like clone with some unique changes. This full-stack reponsive application which will be used to connect with other users through post, comments and other forms or interaction. This project has no intention of being for real users or commercial use. This is purely a personal project.

## Features

- Account creation to save user data
- Discover users post in either "Global" or "My Feed"(posts by users followed)
- Search for users with option to Follow or Unfollow
- View user pages and user data: Posts by users, Followed users, Followers, Liked posts, and addition data
- Post text and emojis with option to make post "Private" (includes character limit & counter)
- Comment on posts and view others comments
- Like/Unlike posts
- Bookmark posts / View bookmarked post

<img width="200" alt="MyGrub Home" src="https://user-images.githubusercontent.com/109553225/235499204-d266543d-d585-4505-aff3-365ff4dd94d8.png">

<img width="200" alt="MyGrub Home" src="https://user-images.githubusercontent.com/109553225/235499379-af3310b3-1388-429d-8a74-09d1df863ae6.png">

## How To Get Started

To run this app install the dependencies and run :

```
node server.js

// or

npm start

```

Requires a postgres database named `flashfeed`. To populate the db in psql run:

```
-i flashFeed.sql
```

## Testing

Requires a postgres database named `flashfeed_test`. In the top-level directory, run:

```
jest -i
```

## Technologies

This full-stack application uses a number of technologies.

FRONTEND: uses [React](https://react.dev/reference/react), CSS, HTML, JavaScript as well as number of dependancies:

- Gramarly API: for textbox spelling and grammer check
- emoji-mart: for adding emojis to messages
- react-time-ago: manage time past since post or comment
- react-router-dom: Used for client-side routing within the React app.
- moment: time for user profile
- axios: used for making HTTP requests from the frontend to the backend server.
- jwt-decode: extract values for JWT
- fortawesome: icons & font
- react-infinite-scroll-component: used for pagenation or "infinite scroll"

BACKEND: uses [Node](https://nodejs.org/en/docs), [Express](https://expressjs.com/en/guide/routing.html), and [PostgreSQL](https://github.com/postgres/postgres) database. There are also number of dependencies:

- bcrypt: hashing & decrypt hashed passwords
- cors: restricts web pages from making requests from a different domain
- morgan: log incoming requests to your server
- jsonschema: validation for json

## Looking Forward

Upcoming Features: -frontend test -notifications/warnings for user interface - Editable profile - Editable post and other content - Nested comments - Collect post view counts. - Abilitiy to post picture
