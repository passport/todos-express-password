var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
