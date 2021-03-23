var express = require('express');
var db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.notifications.find(function(err, records) {
    if (err) { return next(err); }
    res.render('notifications', { user: req.user, notifications: records });
  });
});

module.exports = router;
