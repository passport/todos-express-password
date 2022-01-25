# todos-express-password

This app illustrates how to use [Passport](https://www.passportjs.org/) with
[Express](https://expressjs.com/) to sign users in with a username and password.
Use this example as a starting point for your own web applications.

## Quick Start

To run this app, clone the repository and install dependencies:

```bash
$ git clone https://github.com/passport/todos-express-password.git
$ cd todos-express-password
$ npm install
```

Then start the server.

```bash
$ npm start
```

Navigate to [`http://localhost:3000`](http://localhost:3000).

## Tutorial

Follow along with the step-by-step [Username & Password Tutorial](https://www.passportjs.org/tutorials/password/)
to learn how this app was built.

## Overview

This example illustrates how to use Passport and the [`passport-local`](https://www.passportjs.org/packages/passport-local/)
strategy within an Express application to sign users in with a username and
password.

This app implements the features of a typical [TodoMVC](https://todomvc.com/)
app, and adds sign in functionality.  This app is a traditional web application,
in which all application logic and data persistence is handled on the server.

User interaction is performed via HTML pages and forms, which are rendered via
[EJS](https://ejs.co/) templates and styled with vanilla CSS.  Data is stored in
and queried from a [SQLite](https://www.sqlite.org/) database.

After users sign in, a login session is established and maintained between the
server and the browser with a cookie.  As authenticated users interact with the
app, creating and editing todo items, the login state is restored by
authenticating the session.

## License

[The Unlicense](https://opensource.org/licenses/unlicense)

## Credit

Created by [Jared Hanson](https://www.jaredhanson.me/)
