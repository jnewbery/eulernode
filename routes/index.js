var models = require('../models');
var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.index = function(req, res){
  console.log(req.session);
  res.render('index', {
    title: 'Eulernode',
    locals: {currentUser: req.currentUser}});
};

exports.login_page = function(req, res){
  res.render('login', {
    title: 'Eulernode',
    locals: {currentUser: res.currentUser},
    user: new User()
  });
};

exports.login = function(req, res){
    User.findOne({ username: req.body.user.username }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      res.redirect('/');
    } else {
      console.log('Incorrect credentials');
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
  req.session.destroy(function() {});
  res.redirect('/');
};

