var express = require('express');
var mongoose = require('mongoose');
var Problem = require(__dirname+'/models').Problem;

var app = express.createServer(express.logger());

mongoose.connect('mongodb://localhost/eulernode');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

app.get('/', function(request, response) {
  Problem.find(function (err, problems) {
    if (err) {} // TODO handle err
    // We should use ejs templates here instead of simply dumping the
    // JSON we got from the DB in the webpage.
    response.send(problems); 
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
