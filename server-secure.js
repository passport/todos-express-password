var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var {RateLimiterMemory, RateLimiterRes} = require('rate-limiter-flexible')
var db = require('./db');

// Configure limiters
//
// Limit number of failed authentication attempts from single IP per day
// And limit number of consecutive authentication attempts from username+IP pair
// Memory limiter is for example, you can find more here https://github.com/animir/node-rate-limiter-flexible
const maxWrongAttemptsFromIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterMemory({
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsFromIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 3, // Block for 3 hours, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 14, // Store number for 14 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({
    passReqToCallback: true,
  },
  async function (req, username, password, cb) {
    const usernameIPkey = `${username}_${req.ip}`;
    let resUsernameAndIP;
    try {
      let retrySecs = 0;

      const resGet = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
        limiterSlowBruteByIP.get(req.ip),
      ]);
      resUsernameAndIP = resGet[0];
      const resSlowByIP = resGet[1];

      // Check if IP or Username + IP is already blocked
      if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsFromIPperDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
      } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
      }

      if (retrySecs > 0) {
        return cb(null, false, {statusCode: 429, retrySecs})
      }
    } catch (err) {
      return cb(err)
    }


    db.users.findByUsername(username, async function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user || user.password !== password) {
        try {
          await Promise.all([
            limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey),
            limiterSlowBruteByIP.consume(req.ip)
          ])

          return cb(null, false)
        } catch (rlRejected) {
          if (rlRejected instanceof RateLimiterRes) {
            return cb(null, false, {statusCode: 429, retrySecs: Math.round(rlRejected.msBeforeNext / 1000) || 1})
          } else {
            return cb(rlRejected)
          }
        }
      } else {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          try {
            await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
          } catch(err) {
            // handle err only when other than memory limiter used
          }
        }
        return cb(null, user);
      }
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
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
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function (req, res) {
    res.render('home', {user: req.user});
  });

app.get('/login',
  function (req, res) {
    res.render('login');
  });

app.post('/login',
  function (req, res, next) {
    passport.authenticate('local', function (err, user, context = {}) {
      if (err) {
        return next(err);
      }
      if (context.statusCode === 429) {
        res.set('Retry-After', String(context.retrySecs));
        return res.status(429).send('Too Many Requests');
      }
      if (!user) {
        return res.redirect('/login');
      }

      res.redirect('/');
    })(req, res, next);
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', {user: req.user});
  });

app.listen(3000);
