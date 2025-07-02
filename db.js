const sqlite3 = require("sqlite3");
const mkdirp = require("mkdirp");
const crypto = require("crypto");

mkdirp.sync("./const/db");

const db = new sqlite3.Database("./const/db/todos.db");

db.serialize(function () {
  // create the database schema for the todos app
  db.run(
    "CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )"
  );

  // create an initial user (username: alice, password: letmein)
  const salt = crypto.randomBytes(16);
  db.run("INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)", ["alice", crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"), salt]);
});

module.exports = db;
