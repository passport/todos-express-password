var express = require('express');
var crypto = require('crypto');
var db = require('../db');

var router = express.Router();

router.get('/new', function(req, res, next) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    
    db.run('INSERT INTO users (username, hashed_password, salt, name) VALUES (?, ?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt,
      req.body.name
    ], function(err) {
      if (err) { return next(err); }
      
      var user = {
        id: this.lastID.toString(),
        username: req.body.username,
        displayName: req.body.name
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  });
});

module.exports = router;
