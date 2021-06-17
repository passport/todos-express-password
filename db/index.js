var sqlite3 = require('sqlite3').verbose();

exports = module.exports = new sqlite3.Database('db.sqlite3');
