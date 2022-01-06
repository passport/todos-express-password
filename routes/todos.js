var express = require('express');
var db = require('../db');

var router = express.Router();

// TODO: validation, non empty, trim input

router.post('/', function(req, res, next) {
  db.run('INSERT INTO todos (label) VALUES (?)', [
    req.body.label
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

module.exports = router;
