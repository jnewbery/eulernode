var models = require('../models');
var mongoose = require('mongoose');
var Problem = mongoose.model('Problem');

exports.problem_list = function(req, res){
  Problem.find(function (err, problems) {
    if (err) {
      res.send(404, 'Could not get the problems from DB. Error: ' + err);
    }
    res.send(problems);
  });
};

exports.problem = function(req, res){
  Problem.find({_id: req.params.id}, function (err, problems) {
    if (err) {
      res.send(404, 'Could not get the problems from DB. Error: ' + err);
    }
    if (problems.length == 1) {
      res.send(problems[0]);
    } else {
      res.send(404, 'The requested problem could not be found');
    }
  });
};
