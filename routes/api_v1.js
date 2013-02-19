var models = require('../models');
var mongoose = require('mongoose');
var Problem = mongoose.model('Problem');

exports.problem_list = function(req, res) {
  Problem.find({}, 'id name', function (err, problems) {
    if (err) {
      res.send(404, 'Could not get the problems from DB. Error: ' + err);
    }
    res.send(problems);
  });
};

exports.problem_post = function(req, res) {
  var problem;
  console.log("POST: ");
  console.log(req.body);
  problem = new Problem({
    _id: req.body.number,
    name: req.body.name,
    description: req.body.description,
    answer: req.body.answer
  });
  problem.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(problem);
};


exports.problem = function(req, res) {
  Problem.findOne({_id: req.params.id}, 'id name description', function (err, problem) {
    if (err) {
      res.send(404, 'Could not get the problem from DB. Error: ' + err);
    }
    if (problem !== null) {
      res.send(problem);
    } else {
      res.send(404, 'The requested problem could not be found');
    }
  });
};
