var sqlite3 = require('sqlite3').verbose();

exports.db = new sqlite3.Database('db.sqlite3');

exports.users = require('./users');
