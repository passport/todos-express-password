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
    
    res.locals.todos = rows.map(function(row) {
      return {
        title: row.title,
        completed: row.completed == 1 ? true : false,
        order: row.order,
        url: '/' + row.id
      }
    });
    
    console.log(res.locals);
    
    res.render('todo', { user: req.user });
  });
});

// // TODO: validation, non empty, trim input
router.post('/', function(req, res, next) {
  console.log(req.body)
  
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [
    req.body.title,
    req.body.completed == true ? 1 : null
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

module.exports = router;
