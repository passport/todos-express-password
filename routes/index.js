var express = require('express');
var db = require('../db');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { user: req.user });
  
  db.all('SELECT rowid AS id, * FROM todos', [], function(err, rows) {
  //db.all('SELECT rowid AS id, * FROM todos WHERE label = "xxx"', [], function(err, rows) {
    console.log(err);
    console.log(rows);
    
    res.locals.todos = rows;
    res.render('todo', { user: req.user });
  });
});

module.exports = router;
