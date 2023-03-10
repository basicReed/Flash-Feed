"use strict";

/** Express app for flashFeed  */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const morgan = require("morgan");

const app = express();

// Cross-Origin Resource Sharing (CORS) for the application.
app.use(cors());
// Parses incoming JSON payloads from HTTP requests and makes them available on the req.body object.
app.use(express.json());
// 'tiny' logs only the HTTP method, URL, and response status code to the console.
app.use(morgan("tiny"));

/** Handle 404 errors -- this matches everthing */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler - anything unhandled falls here */
app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== "text") console.log(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
