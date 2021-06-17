var express = require('express');
var db = require('../db');
var crypto = require('crypto');

var router = express.Router();

router.get('/new', function(req, res) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
  
  var salt = crypto.randomBytes(16);
  //var hashedPassword = crypto.pbkdf2Sync(records[i].password, salt, 10000, 32, 'sha256');
  
  crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    
    db.run('INSERT INTO users (username, hashed_password, salt, name) VALUES (?, ?, ?, ?)', [
      req.body.username,
      hashedPassword.toString('base64'),
      salt.toString('base64'),
      req.body.name
    ]);
    
  });
  
  
  
  
});

module.exports = router;
