var express = require('express');
var passport = require('passport');
var path = require('path');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var usersRouter = require('./routes/users');
var notificationsRouter = require('./routes/notifications');

var app = express();

require('./boot/db')();
require('./boot/auth')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/users', usersRouter);
app.use('/notifications', notificationsRouter);

module.exports = app;
