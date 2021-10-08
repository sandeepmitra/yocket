const express = require("express");
const session = require("express-session");
const app = express();
const router = require("./router");

let sessionOptions = session({
  secret: "theonesecret#9078hold",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sessionOptions);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

module.exports = app;
