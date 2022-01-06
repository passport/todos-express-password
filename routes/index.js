var express = require('express');
var db = require('../db');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { user: req.user });
  
  db.all('SELECT rowid AS id, * FROM todos', [], function(err, rows) {
    if (err) { return next(err); }
    
    res.locals.todos = rows.map(function(row) {
      return {
        title: row.title,
        completed: row.completed == 1 ? true : false,
        url: '/' + row.id
      }
    });
    res.locals.remainingCount = res.locals.todos.filter(function(todo) { return !todo.completed; }).length;
    res.render('todo', { user: req.user });
  });
});

router.post('/', function(req, res, next) {
  req.body.title = req.body.title.trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  return res.redirect('/');
}, function(req, res, next) {
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [
    req.body.title,
    req.body.completed == true ? 1 : null
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

router.post('/:id(\\d+)', function(req, res, next) {
  req.body.title = req.body.title.trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  db.run('DELETE FROM todos WHERE rowid = ?', [
    req.params.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
},
function(req, res, next) {
  db.run('UPDATE todos SET title = ?, completed = ? WHERE rowid = ?', [
    req.body.title,
    req.body.completed !== undefined ? 1 : null,
    req.params.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

module.exports = router;
