const express = require("express");
const server = express();
const helmet = require("helmet");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const loginCheck = require("./auth/loggin-check-middlewere");
const cors = require("cors");
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const sessionConfig = {
  name: "session",
  secret: "keep ot secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    knex: require("../data/knexConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(sessionConfig));
server.use("/api/users", loginCheck, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "Server up" });
});

module.exports = server;
