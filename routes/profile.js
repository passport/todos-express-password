var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/', ensureLoggedIn(), function(req, res) {
  res.render('profile', { user: req.user });
});

module.exports = router;
