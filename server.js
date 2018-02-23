var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var router = require('./routers/index')
var fs = require('fs')
var path = require('path')
var proxyMiddleware = require('http-proxy-middleware')
var config = require('./config')


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

var proxyTable = config.dev.proxyTable
// proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(proxyMiddleware(options.filter || context, options))
// })
app.use(proxyMiddleware('/v2/api', {
  target: 'http://c.qianka.com',
  changeOrigin: true,
  cookieDomainRewrite: {
  'http://127.0.0.1:3002': ['http://c.qianka.com']
}}));

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())


var filepath = path.join(__dirname, '/views/pooh/index.html')
app.get('/v2/**', function (req, res) {
  fs.readFile(filepath, function (err, content) {
    if (err) return res.send(err);
    console.log('isme')
    return res.send(content.toString())
  })
})
app.use('/pooh', express.static('views/pooh'))

// app.use('/v2', proxyMiddleware({target: 'http://c.qianka.com', changeOrigin: true}));
// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.json({message:'请先登录', code: 401});
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.use('/api', router)

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/profile/new', function (req, res) {
    res.render('profile', {user: req.user})
})

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5001')
  next()
})

app.use(express.static('public'))

var server = app.listen(3002, function () {
  var address = server.address().address
  var port = server.address().port

  console.log('server listening at ' + address + ' port at ' + port)
});
server.setTimeout(0)
