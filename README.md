# Flash Feed

This is the ReactJS frontend & Node.js/Express backend for Flash Feed, version 1.

Live Demo: [FLASH FEED](https://jordans-flashfeed-app.surge.sh)

_CURRENTLY UNDER DEVELOPMENT_

## Description

Is Flash Feed is a Twitter like clone with some unique changes. This full-stack application which will be used to connect with other users through post, comments and other forms or interaction. This project has no intention of being for real jobs or commercial use. This is purely a personal project.

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

This full-stack application uses a backend including Node, Express, and [PostgreSQL](https://github.com/postgres/postgres) database. The frontend uses React as well as number of dependancies.

## Looking Forward

Editable profile and post will be in the next update.

This app is currently being built. Looking forward there are plans to have editable content, nested comments, abilitiy to post picture and view counts.
