This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users using a username and
password with [form-based authentication](https://en.wikipedia.org/wiki/HTTP%2BHTML_form-based_authentication).
Use this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone https://github.com/passport/express-4.x-local-example.git
$ cd express-4.x-local-example
$ npm install
```

Start the server.

```bash
$ node server.js
```

Open a web browser and navigate to [http://localhost:3000/](http://127.0.0.1:3000/)
to see the example in action.  Log in using username `jack` and password `secret`.

### Brute-Force protection

Here is example of protection against Brute-Force attacks with [rate-limiter-flexible]() package.

Start secure sever.

```bash
$ node server-secure.js
```

Open a web browser and navigate to [http://localhost:3000/](http://127.0.0.1:3000/)
to see the example in action. Log in using username `jack` and password `secret`.

Try to login with wrong credentials 11 times in a row, you'll see `429 Too Many Requests` response.
It is blocked by username and IP pair for 1 hour.

Login endpoint blocks requests by IP for 3 hours as well, if more than 100 failed attempts from single IP per day.

