var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/', ensureLoggedIn(), function(req, res, next) {
  db.users.findOne({ id: req.user.id }, function (err, record) {
    if (err) { return next(err); }
    res.render('profile', { user: record });
  });
});

module.exports = router;
