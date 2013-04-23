var models = require('../models');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var LoginToken = mongoose.model('LoginToken');


exports.index = function(req, res){
  res.render('index', {
    title: 'Eulernode',
    locals: {currentUser: req.currentUser}});
};

// GET /login
exports.login_page = function(req, res){
  res.render('login', {
    title: 'Eulernode',
    messages: req.session.messages,
    locals: {currentUser: res.currentUser},
    user: new User()
  });
  req.session.messages = [];
};

// POST /login
exports.login = function(req, res){
  User.findOne({ username: req.body.user.username }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      // Remember me
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ username: user.username });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    } else {
      console.log('Incorrect credentials');
      req.session.messages = ['The username or password was incorrect'];
      res.redirect('/login');
    }
  });
};

exports.register_page = function(req, res){
  res.render('register', {
    title: 'Eulernode',
    locals: {currentUser: res.currentUser},
    user: new User()
  });
};

exports.register = function(req, res){
  var user = new User(req.body.user);

  function userSaveFailed() {
    console.log('Account creation failed');
    res.render('register', {
      title: 'Eulernode',
      locals: {currentUser: res.currentUser},
      user: new User()
    });
  }
  user.save(function(err) {
    if (err) {
      console.log(err);
      return userSaveFailed();
    }
    console.log('Account created');
    req.session.user_id = user.id;
    res.redirect('/');
  });
};

exports.logout = function(req, res){
  if (req.session) {
    // remove all the login tokens both on the client and the server side
    // for the current user
    LoginToken.remove({ username: req.currentUser.username }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {});
  }
  res.redirect('/login');
};

