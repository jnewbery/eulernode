var models = require('../models');
var mongoose = require('mongoose');
var Problem = mongoose.model('Problem');

exports.index = function(req, res){
  Problem.find(function (err, problems) {
    if (err) {
      res.send(404, 'Could not get the problems from DB. Error: ' + err);
    }
    res.render('index', { title: 'Euler Node', data: problems });
  });
};