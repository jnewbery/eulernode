
var mongoose = require("mongoose");

var problemSchema = mongoose.Schema({
    _id: Number,
    name: String,
    description: String,
    answer: String,
    updated: { "type": Date, "default": Date.now }
});

problemSchema.methods.evaluate = function () {
  // TODO: properly check the solution or scrap this function
  console.log("You solution was correct");
};

// compile the schema
var Problem = mongoose.model('Problem', problemSchema);
