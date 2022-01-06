var express = require('express');
var db = require('../db');

var router = express.Router();

router.post('/', function(req, res, next) {
  db.run('INSERT INTO todos (label) VALUES (?)', [
    req.body.label
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

module.exports = router;
