var express = require('express');
var passport = require('passport');
var path = require('path');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var notificationsRouter = require('./routes/notifications');



// Create a new Express application.
var app = express();

require('./boot/auth')();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/notifications', notificationsRouter);

app.listen(3000);
