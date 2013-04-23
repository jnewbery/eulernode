process.env.NODE_ENV = 'test';

// get the application server module
var app = require("../web");
var http = require("http");
var assert = require("assert");
var Browser = require("zombie");
var mongoose = require("mongoose");
var User = mongoose.model('User');

describe('login page', function() {
  before(function() {
    var port = 4000;
    this.server = http.createServer(app).listen(port, function(){
      console.log("Express server listening on port " + port);
    });
    // TODO: use a different DB when testing
    this.testuser = new User({username: 'testuser', password: 'testtest'});
    this.testuser.save(); // silently ignore if the testuser already exists
    this.browser = new Browser({ site: 'http://localhost:4000' });
  });

  it('should show a login screen', function () {
    var browser = this.browser;
    browser.visit('/login', function () {
      assert.ok(browser.success);
      assert.equal(browser.text('button'), 'Sign in');
      // make sure the session cookie is set
      assert(browser.cookies().get('connect.sid'));
    });
  });

  it('should login', function (done) {
    var browser = this.browser;
    browser.visit('/login', function (err, browser) {
      if (browser.error )
        console.dir("Errors reported:", browser.errors);
      browser.
        fill('user[username]', 'testuser').
        fill('user[password]', 'testtest').
        pressButton('Sign in').then(function () {
          assert.ok(browser.success);
          // successfully logged in and redirected to the main page
          assert.equal(browser.location.pathname, '/');
        }).then(done, done);
    });
  });

  it('should remember me', function (done) {
    var browser = this.browser;
    browser.visit('/login', function (err, browser) {
      if (browser.error )
        console.dir("Errors reported:", browser.errors);
      browser.
        fill('user[username]', 'testuser').
        fill('user[password]', 'testtest').
        check('remember_me').
        pressButton('Sign in').then(function () {
          assert.ok(browser.success);
          // successfully logged in and redirected to the main page
          assert.equal(browser.location.pathname, '/');
          // with remember checkbox set, a logintoken cookie should
          // have been set
          assert(browser.cookies().get('logintoken'));
        }).then(done, done);
    });
  });

  it('should reject nonexisting users', function (done) {
    var browser = this.browser;
    browser.visit('/login', function (err, browser) {
      if (browser.error )
        console.dir("Errors reported:", browser.errors);
      browser.
        fill('user[username]', 'donald').
        fill('user[password]', 'duck').
        pressButton('Sign in').then(function () {
          assert.ok(browser.success);
          // incorrect login should not redirect
          assert.equal(browser.location.pathname, '/login');
          // assert error message is displayed
          // ...
        }).then(done, done);
    });
  });


  // we should really close down the server properly in the end
  after(function(done) {
    this.server.close(done);
  });
});