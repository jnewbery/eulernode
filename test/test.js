process.env.NODE_ENV = 'test';

// get the application server module
var app = require("../web");
var http = require("http");
var assert = require("assert");
var Browser = require("zombie");

describe('login page', function() {
  before(function() {
    this.server = http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
    this.browser = new Browser({ site: 'http://localhost:5000' });
  });

  // load the login page before each test
  beforeEach(function(done) {
    this.browser.visit('/login', done);
  });

  it('should show a login screen', function () {
    var browser = this.browser;
    assert.ok(browser.success);
    assert.equal(browser.text('button'), 'Sign in');
  });

  // we should really close down the server properly in the end
  after(function(done) {
    this.server.close(done);
  });
});