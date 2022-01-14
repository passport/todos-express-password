var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('db.sqlite3');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT \
  )");
  
  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )");
});

module.exports = db;
