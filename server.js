const path = require('path')
const Koa = require('koa')
const render = require('koa-ejs')
const route = require('koa-route')
const passport = require('koa-passport')
const { Strategy } = require('passport-local')

const db = require('./db')

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(async (username, password, done) => {
  try {
    const user = await db.users.findByUsername(username)
    if (!user) {
      return done(null, false)
    }
    if (user.password != password) {
      return done(null, false)
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.users.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// Create a new Koa application.
const app = new Koa()

// Configure view engine to render EJS templates.
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'template',
  viewExt: 'ejs',
  cache: false,
  debug: false
})

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('koa-logger')())
app.use(require('koa-bodyparser')())
app.keys = ['keyboard cat']
app.use(require('koa-session')({}, app))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())

// Define routes.
app.use(route.get('/', async ctx => {
  await ctx.render('home', { user: ctx.req.user })
}))

app.use(route.get('/login', async ctx => {
  await ctx.render('login')
}))

app.use(route.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})))
  
app.use(route.get('/logout', async ctx => {
  await ctx.logout()
  ctx.redirect('/')
}))

// Require authentication for now
app.use((ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
})

app.use(route.get('/profile', async ctx => {
  await ctx.render('profile', { user: ctx.req.user })
}))

app.listen(3000)
